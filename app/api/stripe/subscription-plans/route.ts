
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET() {
    try {
        const prices = await stripe.prices.list({
            expand: ['data.product'],
            active: true,
            type: 'recurring',
          });

          prices.data.map((price) => {
            console.log(price.product);
          });

      
          const plans = prices.data.map(price => ({
            id: price.id,
            name: price.product.name,
            description: price.product.description,
            price: price.unit_amount,
            interval: price.recurring.interval,
            price_id: price.id,
          }));
      
          return NextResponse.json(plans);
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        return NextResponse.json({ error: 'Failed to fetch subscription plans' }, { status: 500 });
    }
}