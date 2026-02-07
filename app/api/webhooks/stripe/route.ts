import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  // 1. Initialiseer Stripe pas HIER
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe Secret Key missing" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // We gebruiken 'as any' om TypeScript tevreden te houden,
    // maar we gebruiken de versie die de library verwacht.
    apiVersion: "2026-01-28.clover" as any,
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      console.error("Missing signature or webhook secret");
      return NextResponse.json(
        { error: "No signature or secret" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price.product"],
        },
      );

      for (const item of lineItems.data) {
        const price = item.price!;
        const product = price.product as Stripe.Product;

        const currentSpots = parseInt(product.metadata.huidige_plekken || "0");
        const quantity = item.quantity || 1;

        await stripe.products.update(product.id, {
          metadata: {
            ...product.metadata,
            huidige_plekken: (currentSpots + quantity).toString(),
          },
        });

        console.log(
          `Updated ${product.name}: ${currentSpots} -> ${currentSpots + quantity} booked spots`,
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
