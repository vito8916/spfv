// app/api/stripe/create-portal-session/route.ts
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    console.log(req);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the user's subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('metadata')
      .eq('user_id', user.id)
      .single();

    if (!subscription?.metadata?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Create a Stripe Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.metadata.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}