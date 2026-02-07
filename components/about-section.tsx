"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Flame,
  DoorOpen,
  HeartPulse,
  BriefcaseMedical,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: HeartPulse,
    title: "Spoedeisende Hulp",
    description:
      "Word expert in reanimatie en het gebruik van de AED. Herken kritieke situaties zoals hartinfarcten, beroertes en ernstige verslikking.",
  },
  {
    icon: BriefcaseMedical,
    title: "Eerste Hulp",
    description:
      "Behandel niet-levensbedreigend letsel met precisie. Van het verzorgen van brandwonden en oogletsel tot het stabiliseren van breuken.",
  },
  {
    icon: Flame,
    title: "Brandbestrijding",
    description:
      "Leer effectief handelen bij beginnende branden. We focussen op blustechnieken, gevarenherkenning en de cruciale beslissing: blussen of ontruimen.",
  },
  {
    icon: DoorOpen,
    title: "Ontruiming",
    description:
      "Beheers de protocollen voor een veilige evacuatie. Inclusief samenwerking met externe hulpdiensten en het beheer van voorzieningen.",
  },
];

export function AboutSection() {
  return (
    <section id="bhv-basis" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Linker Kolom - Cursus Informatie */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 text-sm bg-muted text-muted-foreground">
              Basis BHV Klassikaal
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy tracking-tight text-balance">
              Word de eerste lijn van veiligheid
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              In één intensieve dag van 8 uur leiden wij je op tot een
              volwaardig bedrijfshulpverlener. Je leert direct in te grijpen bij
              ongevallen, brand of ontruimingen om letsel en schade te
              minimaliseren.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Duur
                </p>
                <p className="font-bold text-navy text-lg">8 uur fysiek</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Investering
                </p>
                <p className="font-bold text-navy text-lg">v.a. € 179,- p.p.</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="font-bold text-navy">Wat kun je verwachten?</h4>
              {[
                "Interactieve demonstraties door praktijkexperts",
                "Realistische simulaties van noodsituaties",
                "Oefenen op reanimatiepoppen met AED",
                "Maatwerk voor bedrijfsspecifieke risico's",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-orange hover:bg-orange/90 text-white px-8">
                <FileText className="mr-2 h-4 w-4" /> Inschrijven
              </Button>
              <div className="flex items-center p-4 rounded-xl bg-orange/5 border border-orange/10">
                <p className="text-xs text-navy/80">
                  <span className="font-bold">Resultaat:</span> Officieel
                  BHV-certificaat (1 jaar geldig)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rechter Kolom - De Modules */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6">
            <h4 className="text-xl font-bold text-navy mb-2 lg:hidden">
              Cursusonderdelen
            </h4>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex gap-6 p-6 bg-muted/40 rounded-2xl border border-border hover:border-orange/30 transition-all shadow-sm">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-orange transition-colors">
                  <feature.icon className="w-6 h-6 text-orange group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
