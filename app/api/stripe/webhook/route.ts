import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SubscriptionStatus = "unpaid" | "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing";

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    switch (status) {
        case 'active':
        case 'trialing':
        case 'past_due':
        case 'unpaid':
        case 'canceled':
        case 'incomplete':
        case 'incomplete_expired':
            return status;
        case 'paused':
            return 'incomplete';
        default:
            return 'incomplete';
    }
}

function mapPaymentMethodToStorageFormat(paymentMethod: Stripe.PaymentMethod) {
    return {
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4 || '',
        expMonth: paymentMethod.card?.exp_month || 0,
        expYear: paymentMethod.card?.exp_year || 0,
        brand: paymentMethod.card?.brand || '',
    };
}

function mapAddressToStorageFormat(billingDetails: Stripe.PaymentMethod.BillingDetails) {
    const address = billingDetails.address;
    return {
        street: address?.line1 || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postal_code || '',
        country: address?.country || '',
    };
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature found' },
            { status: 400 }
        );
    }

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                
                // Get the subscription
                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string,
                    {
                        expand: ['default_payment_method']
                    }
                );

                // Get user_id from metadata
                const userId = session.metadata?.user_id;
                if (!userId) {
                    throw new Error('No user ID found in session metadata');
                }

                // Create subscription in Supabase using service role
                const { error: subscriptionError } = await supabase
                    .from('subscriptions')
                    .insert({
                        id: subscription.id,
                        user_id: userId,
                        price_id: subscription.items.data[0].price.id,
                        status: mapStripeStatus(subscription.status),
                        quantity: subscription.items.data[0].quantity || 1,
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        created: new Date(subscription.created * 1000).toISOString(),
                        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        // Only set these fields if they exist in the Stripe subscription
                        ...(subscription.ended_at && {
                            ended_at: new Date(subscription.ended_at * 1000).toISOString(),
                        }),
                        ...(subscription.cancel_at && {
                            cancel_at: new Date(subscription.cancel_at * 1000).toISOString(),
                        }),
                        ...(subscription.canceled_at && {
                            canceled_at: new Date(subscription.canceled_at * 1000).toISOString(),
                        }),
                        metadata: {
                            stripe_subscription_id: subscription.id,
                            stripe_customer_id: subscription.customer as string,
                            plan: subscription.items.data[0].price.product as string,
                        },
                    });

                if (subscriptionError) {
                    console.error('Error creating subscription:', subscriptionError);
                    throw subscriptionError;
                }

                // Update user billing info if payment method exists
                if (subscription.default_payment_method) {
                    const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;
                    const { error: userError } = await supabase
                        .from('users')
                        .update({
                            billing_address: mapAddressToStorageFormat(paymentMethod.billing_details),
                            payment_method: mapPaymentMethodToStorageFormat(paymentMethod),
                        })
                        .eq('id', userId);

                    if (userError) {
                        console.error('Error updating user billing info:', userError);
                    }
                }

                // Update user stripe info in Users table
                const { error: userStripeError } = await supabase
                    .from('users')
                    .update({
                        stripe_customer_id: subscription.customer as string,
                        stripe_subscription_id: subscription.id,
                    })
                    .eq('id', userId);

                if (userStripeError) {
                    console.error('Error updating user stripe info:', userStripeError);
                }

                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                
                // Update subscription status in Supabase
                const { error: updateError } = await supabase
                    .from('subscriptions')
                    .update({
                        status: mapStripeStatus(subscription.status),
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        // Only update these fields if they exist in the Stripe subscription
                        ...(subscription.ended_at && {
                            ended_at: new Date(subscription.ended_at * 1000).toISOString(),
                        }),
                        ...(subscription.cancel_at && {
                            cancel_at: new Date(subscription.cancel_at * 1000).toISOString(),
                        }),
                        ...(subscription.canceled_at && {
                            canceled_at: new Date(subscription.canceled_at * 1000).toISOString(),
                        }),
                    })
                    .eq('id', subscription.id);

                if (updateError) {
                    console.error('Error updating subscription:', updateError);
                    throw updateError;
                }
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 400 }
        );
    }
}