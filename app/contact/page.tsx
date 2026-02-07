"use client";

import React from "react"

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "E-mail",
      value: "info@bhv-certificering.nl",
      href: "mailto:info@bhv-certificering.nl",
    },
    {
      icon: Phone,
      label: "Telefoon",
      value: "0174 - 123 456",
      href: "tel:+31174123456",
    },
    {
      icon: MapPin,
      label: "Adres",
      value: "Opstalweg 21a, 2671 LX Naaldwijk",
      href: "https://maps.google.com/?q=Opstalweg+21a+2671+LX+Naaldwijk",
    },
    {
      icon: Clock,
      label: "Bereikbaar",
      value: "Ma - Vr: 09:00 - 17:00",
      href: null,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-navy tracking-tight text-balance">
              Neem contact op
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Heb je vragen over onze BHV-cursussen of wil je een offerte voor een
              in-company training? We helpen je graag verder.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 sm:p-8 bg-card border-border">
                <h2 className="text-2xl font-semibold text-navy mb-6">
                  Stuur ons een bericht
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-navy mb-2">
                      Bericht verzonden!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="text-navy border-navy/20 hover:bg-navy/5 bg-transparent"
                    >
                      Nieuw bericht sturen
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                      type="hidden"
                      name="access_key"
                      value="31209ca3-9c75-4d61-8e6e-012953513452"
                    />
                    <input
                      type="hidden"
                      name="subject"
                      value="Nieuw contactformulier bericht - BHV Certificering"
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-navy">
                          Naam *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Je volledige naam"
                          className="bg-background border-border focus:border-orange focus:ring-orange"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-navy">
                          Bedrijfsnaam
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          placeholder="Je bedrijfsnaam"
                          className="bg-background border-border focus:border-orange focus:ring-orange"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-navy">
                          E-mailadres *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="je@email.nl"
                          className="bg-background border-border focus:border-orange focus:ring-orange"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-navy">
                          Telefoonnummer
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="06 - 1234 5678"
                          className="bg-background border-border focus:border-orange focus:ring-orange"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-navy">
                        Onderwerp *
                      </Label>
                      <Input
                        id="subject"
                        name="subject_field"
                        type="text"
                        required
                        placeholder="Waar gaat je vraag over?"
                        className="bg-background border-border focus:border-orange focus:ring-orange"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-navy">
                        Bericht *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Schrijf hier je bericht..."
                        className="bg-background border-border focus:border-orange focus:ring-orange resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange text-accent-foreground hover:bg-orange/90 font-semibold h-12"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verzenden...
                        </>
                      ) : (
                        <>
                          Verstuur bericht
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-semibold text-navy mb-6">
                  Contactgegevens
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-orange" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="font-medium text-navy hover:text-orange transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="font-medium text-navy">{item.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-border h-64 md:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2456.7890!2d4.2089!3d51.9983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b0a0a0a0a0a0%3A0x0!2sOpstalweg%2021a%2C%202671%20LX%20Naaldwijk!5e0!3m2!1snl!2snl!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Locatie BHV Certificering"
                />
              </div>

              {/* FAQ Teaser */}
              <Card className="p-6 bg-navy text-background">
                <h3 className="text-lg font-semibold mb-2">
                  Veelgestelde vragen?
                </h3>
                <p className="text-background/70 mb-4 text-sm">
                  Bekijk onze FAQ pagina voor antwoorden op de meest gestelde vragen
                  over onze BHV-cursussen.
                </p>
                <Button
                  variant="outline"
                  className="border-background/20 text-background hover:bg-background/10 bg-transparent"
                  asChild
                >
                  <a href="/#faq">Bekijk FAQ</a>
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
