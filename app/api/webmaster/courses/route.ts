import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover" as any,
});

export async function GET() {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    const successfulSessions = sessions.data.filter(
      (session) => session.payment_status === "paid",
    );

    const courseStats = products.data.map((product) => {
      const price = product.default_price as Stripe.Price | null;
      const meta: Record<string, string> = {};

      if (product.metadata) {
        Object.keys(product.metadata).forEach((key) => {
          meta[key.trim()] = product.metadata[key];
        });
      }

      const productSessions = successfulSessions.filter(
        (session) => session.metadata?.course_id === product.id,
      );

      const totalParticipants = productSessions.reduce((sum, session) => {
        const count = parseInt(session.metadata?.aantal_deelnemers || "0", 10);
        return sum + (isNaN(count) ? 0 : count);
      }, 0);

      // --- DE DATUM LOGICA ---
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

      const datumStr = meta.datum || meta.date;
      let formattedDate = "Datum volgt";
      let sortDate = new Date(2099, 0, 1); // Fallback voor sortering

      if (datumStr) {
        const d = new Date(datumStr);
        if (!isNaN(d.getTime())) {
          sortDate = d;
          formattedDate = `${d.getDate()} ${months[d.getMonth()]}`;
        }
      }

      return {
        id: product.id,
        title: product.name,
        date: formattedDate,
        dayOfWeek: meta.tijd || "Tijd volgt",
        totalBookings: productSessions.length,
        totalParticipants: totalParticipants,
        priceId: price?.id || null,
        sortDate: sortDate,
      };
    });

    const sortedCourses = courseStats
      .filter((course) => course.totalParticipants > 0)
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    return NextResponse.json(sortedCourses);
  } catch (error: any) {
    console.error("Fout in webmaster route:", error.message);
    return NextResponse.json({ error: "Stripe data error" }, { status: 500 });
  }
}
