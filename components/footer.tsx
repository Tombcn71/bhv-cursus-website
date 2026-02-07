"use client";

import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  cursussen: [
    { label: "BHV Basis", href: "#" },
    { label: "BHV Herhaling", href: "#" },
    { label: "AED Training", href: "#" },
    { label: "In-Company", href: "#" },
  ],
  bedrijf: [
    { label: "Over Ons", href: "#over-ons" },
    { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "#" },
  ],
  juridisch: [
    { label: "Algemene Voorwaarden", href: "#" },
    { label: "Privacybeleid", href: "#" },
    { label: "Cookiebeleid", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer id="contact" className="bg-navy text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-navy" />
              </div>
              <span className="font-semibold text-lg">BHV Certificering</span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              Dé specialist in bedrijfshulpverlening. NIBHV gecertificeerde trainingen 
              door ervaren professionals uit de hulpverleningsdiensten.
            </p>
            
            <div className="space-y-3">
              <a
                href="mailto:info@bhvacademie.nl"
                className="flex items-center gap-3 text-background/70 hover:text-orange transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>info@bhvcertificering.nl</span>
              </a>
              <a
                href="tel:+31201234567"
                className="flex items-center gap-3 text-background/70 hover:text-orange transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>06-80118357 </span>
              </a>
              <div className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                
Jachthuislaan 57
3762LB Soest
KVK: 92893538
IBAN: NL03KNAB0775919632
BTW: NL004984983B54
                </span>
              </div>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4">Cursussen</h3>
            <ul className="space-y-3">
              {footerLinks.cursussen.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4">Bedrijf</h3>
            <ul className="space-y-3">
              {footerLinks.bedrijf.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4">Juridisch</h3>
            <ul className="space-y-3">
              {footerLinks.juridisch.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} BHV Academie. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/50">
            <span>KVK: 12345678</span>
            <span>BTW: NL123456789B01</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
