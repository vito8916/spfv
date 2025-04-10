import { getCurrentRegistrationStep, RegistrationStep } from "@/app/actions/registration";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const REGISTRATION_ROUTES = [
  '/account-confirmation',
  '/additional-data',
  '/agreements',
  '/questionnaire',
  '/opra-agreements',
  '/registration-completed'
];

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Get the user
    const { data: { user } } = await supabase.auth.getUser();


    // Define routes
    const publicRoutes = ['/', '/sign-in', '/sign-up', '/auth/callback', '/auth/confirm'];
    const protectedRoutes = ['/dashboard', '/settings', '/profile', '/spfv/screener', '/spfv/calculator', '/spfv'];
    const currentPath = request.nextUrl.pathname;

    // Check if the user is on the registration route
    if (REGISTRATION_ROUTES.some(route => currentPath.startsWith(route))) {
      if (!user) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
      // Get current registration progress
      const { success, currentStep, error } = await getCurrentRegistrationStep();
      if (!success) throw new Error(error);

      // Convert current route to step type
      const currentRouteStep = currentPath.substring(1).replace(/-/g, '_') as RegistrationStep;

      // Check if step is accessible
      const isCurrent = currentStep === currentRouteStep;
      if (!isCurrent) {
        // Redirect to current step
        const redirectStep = currentStep.replace(/_/g, '-');
        return NextResponse.redirect(new URL(`/${redirectStep}`, request.url));
      }
      
    }

    // Check protected routes first
    if (protectedRoutes.some(route => currentPath.startsWith(route))) {
      // Check authentication first
      if (!user) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

      // Handle subscription states
      if (!subscription) {
        //return to the current step
        const { success, currentStep, error } = await getCurrentRegistrationStep();
        if (!success) throw new Error(error);
        const redirectStep = currentStep.replace(/_/g, '-');
        return NextResponse.redirect(new URL(`/${redirectStep}`, request.url));
      }

      if (subscription && subscription.status !== 'active' && !currentPath.startsWith('/settings')) {
        return NextResponse.redirect(new URL('/settings', request.url));
      }

      if (subscription?.status === 'active' && currentPath === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Handle public routes
    if (publicRoutes.some(route => currentPath.startsWith(route))) {
      // If user is logged in and tries to access auth pages, check subscription and redirect
      if (user && ['/sign-in', '/sign-up'].some(route => currentPath.startsWith(route))) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (subscription) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
      return response;
    }

    // For any other routes, require authentication
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return response;
  } catch (e) {
    console.error('Middleware error:', e);
    // If there's an error, redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }
};