"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Calendar, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <section className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-navy tracking-tight mb-4">
            Bedankt voor je inschrijving!
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Je ontvangt binnen enkele minuten een bevestigingsmail met alle
            details over je BHV-cursus.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <Card className="p-5 bg-muted/50 border-border text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">
                    Check je inbox
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Je bevestigingsmail bevat de cursuslocatie, tijd en wat je
                    moet meenemen.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-muted/50 border-border text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">
                    Zet in je agenda
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vergeet niet de cursusdatum in je agenda te zetten. Tot dan!
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-orange text-accent-foreground hover:bg-orange/90 font-semibold"
              asChild>
              <Link href="/">
                Terug naar home
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-navy border-navy/20 hover:bg-navy/5 bg-transparent font-semibold"
              asChild>
              <Link href="/contact">Vragen? Neem contact op</Link>
            </Button>
          </div>

          <Card className="p-6 bg-muted/50 text-foreground max-w-md mx-auto">
            <h3 className="font-semibold mb-3 text-navy">Nog vragen?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Neem gerust contact met ons op als je vragen hebt over je
              inschrijving.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a
                href="mailto:info@bhv-certificering.nl"
                className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors">
                <Mail className="w-4 h-4" />
                info@bhv-certificering.nl
              </a>
              <a
                href="tel:+31174123456"
                className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors">
                <Phone className="w-4 h-4" />
                0174 - 123 456
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function BedanktPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Laden...
          </div>
        }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}
