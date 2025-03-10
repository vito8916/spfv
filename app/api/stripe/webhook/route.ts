import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

// Your webhook secret from Stripe Dashboard or environment variables
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    ) as Stripe.Event;

    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Handle successful checkout
        await handleCheckoutSession(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const payment = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment
        await handlePaymentSuccess(payment);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription changes
        await handleSubscriptionChange(event.type, subscription);
        break;
      }

      // Add more event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Webhook error:', error.message);
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 400 }
    );
  }
}

// Handler functions
async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  // Add your checkout session handling logic here
  console.log('Processing checkout session:', session.id);
}

async function handlePaymentSuccess(payment: Stripe.PaymentIntent) {
  // Add your payment success handling logic here
  console.log('Processing successful payment:', payment.id);
}

async function handleSubscriptionChange(
  eventType: string,
  subscription: Stripe.Subscription
) {
  // Add your subscription change handling logic here
  console.log(`Processing ${eventType} for subscription:`, subscription.id);
}