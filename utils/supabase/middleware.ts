import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

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
    const publicRoutes = ['/', '/sign-in', '/sign-up', '/auth/callback', '/additional-data', '/agreements', '/success-payment'];
    const protectedRoutes = ['/dashboard', '/settings', '/profile', '/account-confirmation'];
    const currentPath = request.nextUrl.pathname;

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
      if (!subscription && currentPath !== '/account-confirmation') {
        return NextResponse.redirect(new URL('/account-confirmation', request.url));
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