"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Hoe lang is mijn BHV-certificaat geldig?",
    answer:
      "Je BHV-certificaat is 1 jaar geldig. Dit is conform de richtlijnen van het NIBHV en de Arbowet. We sturen je automatisch een herinnering wanneer het tijd is voor hercertificering.",
  },
  {
    question: "Wat houdt de cursus precies in?",
    answer:
      "De BHV-basiscursus omvat: reanimatie en AED-gebruik, brandbestrijding met kleine blusmiddelen, ontruimingsprocedures, en basis EHBO. De cursus duurt één volledige dag (09:00-17:00) inclusief lunch.",
  },
  {
    question: "Bieden jullie ook in-company trainingen aan?",
    answer:
      "Ja, we verzorgen trainingen op locatie bij uw bedrijf. Dit is ideaal voor groepen vanaf 6 personen. U bepaalt zelf de datum en wij komen naar u toe met alle benodigde materialen. Vraag een vrijblijvende offerte aan.",
  },
  {
    question: "Wat als ik niet slaag voor de cursus?",
    answer:
      "Wij hanteren een 100% slagingsgarantie. Mocht je onverhoopt niet slagen, dan mag je kosteloos opnieuw deelnemen aan een volgende cursusdag. We willen dat iedereen met vertrouwen naar huis gaat.",
  },
  {
    question: "Hoeveel BHV'ers heeft mijn bedrijf nodig?",
    answer:
      "Volgens de Arbowet moet elk bedrijf voldoende BHV'ers hebben. De vuistregel is minimaal 1 BHV'er per 50 medewerkers, maar dit hangt af van risicofactoren zoals branche, gebouwgrootte en aanwezige gevaren. Wij adviseren u graag.",
  },
  {
    question: "Kan ik de cursus annuleren of verplaatsen?",
    answer:
      "Annuleren is kosteloos tot 14 dagen voor aanvang. Tussen 14 en 7 dagen betaalt u 50% van de kosten. Verplaatsen naar een andere datum is altijd kosteloos mogelijk, mits er beschikbaarheid is.",
  },
  {
    question: "Wat moet ik meenemen naar de cursus?",
    answer:
      "Draag comfortabele kleding waarin je kunt bewegen (denk aan reanimatie-oefeningen). Alle lesmaterialen, lunch en versnaperingen zijn inbegrepen. Een geldig legitimatiebewijs is vereist.",
  },
  {
    question: "Worden de kosten vergoed door de werkgever?",
    answer:
      "BHV-training is een wettelijke verplichting voor werkgevers. De kosten worden daarom vrijwel altijd door de werkgever vergoed. Wij kunnen factureren op bedrijfsnaam met betaaltermijn.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm bg-muted text-muted-foreground">
            Veelgestelde Vragen
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy tracking-tight text-balance">
            Alles wat je moet weten
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Heb je een vraag? Bekijk de antwoorden hieronder of neem contact met ons op.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={`faq-${index}`}
                value={`item-${index}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="text-left font-semibold text-navy hover:text-orange hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center text-muted-foreground"
        >
          Staat je vraag er niet bij?{" "}
          <a href="#contact" className="text-orange hover:underline font-medium">
            Neem contact op
          </a>
        </motion.p>
      </div>
    </section>
  );
}
