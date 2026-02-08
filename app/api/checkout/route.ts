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
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe Secret Key is missing" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover" as any,
  });

  try {
    const { courseId, priceId, quantity, participants } = await req.json();

    // JOUW METADATA LOGICA (ongewijzigd)
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

    // DE URL FIX: Zorg dat baseUrl klopt
    const baseUrl =
      process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") ||
      "https://www.bhv-certificering.nl";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/inschrijven/${courseId}`,
      automatic_tax: { enabled: false },
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      locale: "nl",
      metadata: metadata, // HIER wordt je metadata meegegeven
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
