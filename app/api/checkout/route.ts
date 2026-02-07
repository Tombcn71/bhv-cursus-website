import { NextResponse } from "next/server";
import Stripe from "stripe";

interface Participant {
  aanhef: string;
  voorletters: string;
  voornaam: string;
  tussenvoegsel: string;
  achternaam: string;
  geboortedatum: string;
  telefoon: string;
  email: string;
}

export async function POST(req: Request) {
  // Verplaats de initialisatie naar HIER
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe Secret Key is missing in server environment" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // We gebruiken 'as any' om TypeScript tevreden te houden,
    // maar we gebruiken de versie die de library verwacht.
    apiVersion: "2026-01-28.clover" as any,
  });

  try {
    const { courseId, priceId, quantity, participants } = await req.json();

    if (!priceId || !quantity) {
      return NextResponse.json(
        { error: "Price ID and quantity are required" },
        { status: 400 },
      );
    }

    // Convert participants array to flat metadata object
    const metadata: Record<string, string> = {
      course_id: courseId,
      aantal_deelnemers: quantity.toString(),
    };

    if (participants && Array.isArray(participants)) {
      participants.forEach((participant: Participant, index: number) => {
        const num = index + 1;
        metadata[`deelnemer_${num}_aanhef`] = participant.aanhef;
        metadata[`deelnemer_${num}_voorletters`] = participant.voorletters;
        metadata[`deelnemer_${num}_voornaam`] = participant.voornaam;
        metadata[`deelnemer_${num}_tussenvoegsel`] =
          participant.tussenvoegsel || "";
        metadata[`deelnemer_${num}_achternaam`] = participant.achternaam;
        metadata[`deelnemer_${num}_geboortedatum`] = participant.geboortedatum;
        metadata[`deelnemer_${num}_telefoon`] = participant.telefoon;
        metadata[`deelnemer_${num}_email`] = participant.email;
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/inschrijven/${courseId}`,
      automatic_tax: { enabled: false },
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      locale: "nl",
      metadata: metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
