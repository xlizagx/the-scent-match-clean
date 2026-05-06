import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ConsultationTeaser() {
  return (
    <section id="consultation" className="py-16 px-6 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <span className="inline-block text-xs font-body font-medium tracking-[0.2em] uppercase text-primary border border-primary/40 rounded-full px-4 py-1.5 mb-6">
          Coming Soon
        </span>

        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
        </div>

        <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4 leading-tight">
          Your Personal Scent Session
        </h2>

        <p className="text-muted-foreground font-body text-base mb-3 max-w-md mx-auto leading-relaxed">
          For those who want something more. A private one-to-one call with our fragrance expert - we get to know you, ask the right questions, and find your perfect match together.
        </p>

        <p className="text-foreground font-body text-sm font-medium mb-8">
          Register your interest today and secure our exclusive introductory rate.
        </p>

        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12">
          <Link to="/support#contact" state={{ issueType: 'Personal Scent Session - Early Access' }}>
            Register Your Interest →
          </Link>
        </Button>

        <p className="text-center text-xs text-muted-foreground font-body mt-4">
          Limited spaces · £35 introductory offer
        </p>
      </motion.div>
    </section>
  );
}
