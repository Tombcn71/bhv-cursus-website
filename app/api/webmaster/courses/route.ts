import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function GET() {
  try {
    // Get all products (courses)
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Get all successful payments
    const payments = await stripe.paymentIntents.list({
      limit: 100,
      expand: ["data.charges.data.balance_transaction"],
    });

    // Filter successful payments only
    const successfulPayments = payments.data.filter(
      (payment) => payment.status === "succeeded",
    );

    // Group payments by product
    const courseStats = products.data.map((product) => {
      const price = product.default_price as Stripe.Price;

      // Trim metadata keys
      const meta: Record<string, string> = {};
      Object.keys(product.metadata).forEach((key) => {
        meta[key.trim()] = product.metadata[key];
      });

      // Find all payments for this product
      const productPayments = successfulPayments.filter((payment) => {
        // Check if payment metadata contains this course_id
        return payment.metadata?.course_id === product.id;
      });

      // Count total participants from all bookings
      const totalParticipants = productPayments.reduce((sum, payment) => {
        const count = parseInt(payment.metadata?.aantal_deelnemers || "0");
        return sum + count;
      }, 0);

      // Format date
      const datumStr = meta.datum || meta.date;
      const datum = datumStr ? new Date(datumStr) : new Date();
      const day = datum.getDate();
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
      const month = months[datum.getMonth()];
      const formattedDate = datumStr ? `${day} ${month}` : "Datum volgt";

      return {
        id: product.id,
        title: product.name,
        date: formattedDate,
        dayOfWeek: meta.tijd || "Tijd volgt",
        totalBookings: productPayments.length,
        totalParticipants: totalParticipants,
        priceId: price.id,
        sortDate: datum,
      };
    });

    // Sort by date
    const sortedCourses = courseStats
      .filter((course) => course.totalParticipants > 0) // Only show courses with bookings
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    return NextResponse.json(sortedCourses);
  } catch (error) {
    console.error("Error fetching course statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
