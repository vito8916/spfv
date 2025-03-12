import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { unstable_cache } from 'next/cache';
import Stripe from 'stripe';

// Define the return type for better type safety
type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  marketing_features: string[];
  interval: string;
  price_id: string;
};

interface ExtendedProduct extends Stripe.Product {
  marketing_features: Array<{ name: string }>;
}

// Cache the subscription plans for 1 hour (3600 seconds)
const getSubscriptionPlans = unstable_cache(
  async (): Promise<SubscriptionPlan[]> => {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
      type: 'recurring',
    });

    return prices.data.map(price => {
      const product = price.product as ExtendedProduct;
      
      // Extract feature names from marketing_features array
      const features = product.marketing_features?.map(feature => feature.name) || ["Access to basic features"];
      
      return {
        id: price.id,
        name: product.name,
        description: product.description || '',
        price: price.unit_amount || 0,
        marketing_features: features,
        interval: price.recurring?.interval || 'month',
        price_id: price.id,
      };
    });
  },
  ['subscription-plans'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['subscription-plans'],
  }
);

export const dynamic = 'force-dynamic'; // Ensure route handler is dynamic
export const runtime = 'edge'; // Optional: Use edge runtime for better performance

export async function GET() {
  try {
    const plans = await getSubscriptionPlans();
    
    // Sort plans by price for consistency
    const sortedPlans = plans.sort((a, b) => (a.price || 0) - (b.price || 0));
    
    return NextResponse.json(sortedPlans, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' }, 
      { status: 500 }
    );
  }
}

/* Response example:

[{"id":"price_1R0AioIzWxIFFnwWMTDgobSx","name":"Fund-Market Maker Plan","description":"Advanced infrastructure and execution capabilities designed for professional funds and market makers. Access deep liquidity, automated strategies, and dedicated support to confidently manage high-volume trades.","price":50000,"marketing_features":[{"name":"Full SPFV suite access"},{"name":"Real-time advanced analytics"},{"name":"VIP community access"},{"name":"Dedicated support team"},{"name":"API access"}],"interval":"month","price_id":"price_1R0AioIzWxIFFnwWMTDgobSx"},{"id":"price_1R0AiMIzWxIFFnwWyVsUSUG8","name":"Individual Trader Plan","description":"Essential tools and insights for solo traders seeking to optimize performance. Get real-time market data, streamlined analytics, and responsive support to elevate your trading journey.","price":30000,"marketing_features":[{"name":"Advanced SPFV tools access"},{"name":"Real-time market analysis"},{"name":"Priority community access"}],"interval":"month","price_id":"price_1R0AiMIzWxIFFnwWyVsUSUG8"}]

*/