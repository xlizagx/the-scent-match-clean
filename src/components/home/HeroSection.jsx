import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Model wearing a black hoodie with Vanilla Is My Love Language design"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary">
              Fragrance-Inspired Apparel
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-foreground mb-6">
            Wearable Scent-Inspired<br />
            <span className="text-primary">Gifts, Ready To Ship.</span>
          </h1>

          <p className="font-body text-base md:text-lg text-foreground/75 leading-relaxed mb-8 max-w-lg mx-auto font-light tracking-wide">
            Hoodies, tees, totes and more - designed for the fragrance obsessed.
          </p>

          <Button
            asChild
            size="lg"
            className="w-full sm:w-72 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2 mx-auto"
          >
            <Link to="/shop">
              <ShoppingBag className="w-4 h-4" />
              Shop The Collection
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce opacity-60">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
