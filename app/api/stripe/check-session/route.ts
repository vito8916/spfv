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

        // Get session ID from request body
        const { sessionId } = await req.json();
        if (!sessionId) {
            return NextResponse.json(
                { error: "Session ID is required" },
                { status: 400 }
            );
        }

        // Retrieve the checkout session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { error: "Payment not completed" },
                { status: 400 }
            );
        }

        // Return success - the webhook will handle the subscription creation
        return NextResponse.json({ status: 'complete' });
    } catch (error) {
        console.error('Error checking session:', error);
        return NextResponse.json(
            { error: "Failed to verify payment" },
            { status: 500 }
        );
    }
}