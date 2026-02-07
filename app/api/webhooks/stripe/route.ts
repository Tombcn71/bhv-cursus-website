import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get line items to find which products were purchased
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      // Update inventory for each purchased product
      for (const item of lineItems.data) {
        const price = item.price!;
        const product = price.product as Stripe.Product;

        const currentSpots = parseInt(product.metadata.huidige_plekken || '0');
        const quantity = item.quantity || 1;

        // Update the product metadata with new spot count
        await stripe.products.update(product.id, {
          metadata: {
            ...product.metadata,
            huidige_plekken: (currentSpots + quantity).toString(),
          },
        });

        console.log(`Updated ${product.name}: ${currentSpots} -> ${currentSpots + quantity} booked spots`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}