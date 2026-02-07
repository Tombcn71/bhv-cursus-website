"use client";

import { Badge } from "@/components/ui/badge";
import { Star, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Martijn de Vries",
    role: "HR Manager",
    company: "TechFlow B.V.",
    rating: 5,
    text: "Uitstekende training! Onze hele afdeling heeft de cursus gevolgd en iedereen was enthousiast. De instructeur maakte het levendig en praktisch.",
    featured: true,
  },
  {
    id: 2,
    name: "Lisa Jansen",
    role: "Office Manager",
    company: "Advocatenkantoor Bakker",
    rating: 5,
    text: "Compact, duidelijk en vooral praktisch. De reanimatie-oefeningen waren erg leerzaam.",
  },
  {
    id: 3,
    name: "Pieter Smit",
    role: "Facilitair Manager",
    company: "Gemeente Utrecht",
    rating: 5,
    text: "Al jaren onze vaste partner voor BHV-trainingen. Altijd betrouwbaar en professioneel.",
    featured: true,
  },
  {
    id: 4,
    name: "Emma van der Berg",
    role: "CEO",
    company: "StartupHub Amsterdam",
    rating: 5,
    text: "De in-company optie was perfect voor ons groeiende team. Flexibel en op maat.",
  },
  {
    id: 5,
    name: "Johan Bakker",
    role: "Operations Director",
    company: "LogiTrans BV",
    rating: 5,
    text: "Zeer professionele organisatie. Van boeking tot certificaat verliep alles vlekkeloos.",
  },
  {
    id: 6,
    name: "Sarah de Groot",
    role: "Practice Manager",
    company: "Tandartspraktijk Smile",
    rating: 5,
    text: "De instructeur had ervaring in de zorg, wat de training extra relevant maakte voor ons team.",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={`star-${rating}-${i}`}
        className={`w-4 h-4 ${
          i < rating ? "fill-orange text-orange" : "fill-muted text-muted"
        }`}
      />
    ))}
  </div>
);

export function ReviewsSection() {
  return (
    <section id="reviews" className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm bg-background text-muted-foreground">
            Ervaringen
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy tracking-tight text-balance">
            Wat onze klanten zeggen
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Meer dan 15.000 tevreden deelnemers gingen je voor. 
            Lees hun ervaringen met onze BHV-trainingen.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-6 bg-background rounded-2xl border border-border hover:border-orange/30 transition-all duration-300 hover:shadow-lg ${
                review.featured ? "md:row-span-2 flex flex-col justify-between" : ""
              }`}
            >
              <div>
                <StarRating rating={review.rating} />
                <p className={`mt-4 text-muted-foreground leading-relaxed ${
                  review.featured ? "text-lg" : "text-sm"
                }`}>
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{review.company}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-center"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={`overall-star-${i}`} className="w-5 h-5 fill-orange text-orange" />
              ))}
            </div>
            <span className="font-semibold text-navy">4.9/5</span>
          </div>
          <span className="text-muted-foreground">
            Gebaseerd op 1.247 beoordelingen
          </span>
        </motion.div>
      </div>
    </section>
  );
}
