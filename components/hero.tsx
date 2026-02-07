"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left">
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground">
                <ShieldCheck className="w-4 h-4 mr-2 text-orange" />
                NIBHV Gecertificeerd
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground">
                <Award className="w-4 h-4 mr-2 text-orange" />
                Conform Arbowet
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight tracking-tight text-balance"
            >
              Veiligheid op de werkvloer{" "}
              <span className="text-orange">begint hier.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground text-pretty"
            >
              In één dag je BHV-certificaat. Praktijkgerichte training door ervaren
              instructeurs op locaties door heel Nederland.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-start gap-4"
            >
              <Button
                size="lg"
                className="bg-orange text-accent-foreground hover:bg-orange/90 font-semibold text-base px-8 h-12"
                asChild
              >
                <a href="#cursussen">
                  Bekijk Cursusdata
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-base px-8 h-12 text-navy border-navy/20 hover:bg-navy/5 bg-transparent"
              >
                In-Company Offerte
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange" />
                <span>Direct certificaat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange" />
                <span>Kleine groepen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange" />
                <span>{"100% slagingsgarantie"}</span>
              </div>
            </motion.div>

            
          </div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-bhv.jpg"
                alt="BHV instructeur demonstreert reanimatietechnieken aan cursisten"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/10 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg p-4 border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy">Erkend opleidingsinstituut</div>
                  <div className="text-xs text-muted-foreground">NIBHV geregistreerd</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
