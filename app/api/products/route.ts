import { NextResponse } from "next/server";
import Stripe from "stripe";

// We initialiseren stripe pas binnen de functie om build-errors te voorkomen
let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // We gebruiken 'as any' om TypeScript tevreden te houden,
      // maar we gebruiken de versie die de library verwacht.
      apiVersion: "2026-01-28.clover" as any,
    });
  }
  return stripe;
}

// Helper functie om datum te formatteren
function formatDutchDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = [
    "jan",
    "feb",
    "mrt",
    "apr",
    "mei",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ];
  const month = months[date.getMonth()];
  return `${day} ${month}`;
}

export async function GET() {
  try {
    const stripeInstance = getStripe();

    const products = await stripeInstance.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    const courses = products.data
      .map((product) => {
        const price = product.default_price as Stripe.Price;

        const meta: Record<string, string> = {};
        Object.keys(product.metadata).forEach((key) => {
          meta[key.trim()] = product.metadata[key];
        });

        const datumStr = meta.datum || meta.date;
        const datum = datumStr ? new Date(datumStr) : new Date();

        return {
          id: product.id,
          priceId: price.id,
          title: product.name,
          description: product.description || "",
          date: datumStr ? formatDutchDate(datumStr) : "Datum volgt",
          dayOfWeek: meta.tijd || "Tijd volgt",
          location: meta.locatie || "",
          address: meta.adres || "",
          totalSpots: parseInt(meta.max_plekken || "12"),
          availableSpots:
            parseInt(meta.max_plekken || "12") -
            parseInt(meta.huidige_plekken || "0"),
          price: Math.round((price.unit_amount || 0) / 100),
          sortDate: datum,
        };
      })
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
