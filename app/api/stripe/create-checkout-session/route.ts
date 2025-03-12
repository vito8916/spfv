import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Get request body
        const { priceId } = await req.json();
        if (!priceId) {
            return NextResponse.json(
                { error: "Price ID is required" },
                { status: 400 }
            );
        }

        // Get origin from request headers
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL;

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            billing_address_collection: 'required',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/success-payment?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/account-confirmation`,
            metadata: {
                user_id: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}