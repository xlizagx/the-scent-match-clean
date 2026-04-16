import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function FooterCTA() {
  return (
    <>
      {/* Review action block */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <Star className="w-8 h-8 text-primary mx-auto mb-6 fill-primary" />
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4 leading-tight">
            Loved your match? Leave a review
          </h2>
          <p className="text-muted-foreground font-body text-base mb-8 max-w-md mx-auto leading-relaxed">
            Help others choose the perfect fragrance gift with confidence.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12">
            <a href="/support#review">Leave a Review</a>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-6">
        <div className="max-w-5xl mx-auto flex justify-center">
          <img
            src="https://media.base44.com/images/public/69cac3f60d3002bf060b0af7/77b7a26b6_0F24452C-74B5-41E9-A3C8-22250A3F06E7.png"
            alt="The Scent Match"
            className="h-14 w-auto object-contain opacity-80"
          />
        </div>
      </footer>
    </>
  );
}