import { NextResponse } from "next/server";
import Stripe from "stripe";
import * as XLSX from "xlsx";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover" as any,
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;

    // 1. Haal de sessies op
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const successfulSessions = sessions.data.filter(
      (s) => s.metadata?.course_id === courseId && s.payment_status === "paid",
    );

    if (successfulSessions.length === 0) {
      return new NextResponse("Geen deelnemers gevonden", { status: 404 });
    }

    // 2. Data voorbereiden
    const data: any[] = [];
    successfulSessions.forEach((session) => {
      const m = session.metadata || {};
      const aantal = parseInt(m.aantal_deelnemers || "0", 10);

      for (let i = 1; i <= aantal; i++) {
        if (m[`deelnemer_${i}_voornaam`]) {
          data.push({
            Aanhef: m[`deelnemer_${i}_aanhef`] || "",
            Voornaam: m[`deelnemer_${i}_voornaam`] || "",
            Tussenvoegsel: m[`deelnemer_${i}_tussenvoegsel`] || "",
            Achternaam: m[`deelnemer_${i}_achternaam`] || "",
            Email: m[`deelnemer_${i}_email`] || "",
            Telefoon: m[`deelnemer_${i}_telefoon`] || "",
            Geboortedatum: m[`deelnemer_${i}_geboortedatum`] || "",
            Betaaldatum: new Date(session.created * 1000).toLocaleDateString(
              "nl-NL",
            ),
          });
        }
      }
    });

    // 3. Maak het Excel werkblad
    const worksheet = XLSX.utils.json_to_sheet(data);

    // --- BREEDTE INSTELLEN ---
    const cols = [
      { wch: 10 }, // Aanhef
      { wch: 20 }, // Voornaam
      { wch: 15 }, // Tussenvoegsel
      { wch: 25 }, // Achternaam
      { wch: 35 }, // Email
      { wch: 18 }, // Telefoon
      { wch: 18 }, // Geboortedatum
      { wch: 15 }, // Betaaldatum
    ];
    worksheet["!cols"] = cols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Deelnemers");

    // 4. Schrijf naar buffer
    const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // 5. Terugsturen
    return new NextResponse(buf, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="deelnemers-${courseId}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Excel Export Error:", error.message);
    return new NextResponse("Fout bij genereren Excel", { status: 500 });
  }
}
