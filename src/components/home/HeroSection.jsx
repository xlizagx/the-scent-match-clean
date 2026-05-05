import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gem, Sparkles, Feather } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
export default function HeroSection({ heroImage }) {
  const navigate = useNavigate();
  const handleRoute = (route) => {
    navigate('/quiz', { state: { route } });
  };
  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury perfume bottle in warm golden light"
          className="w-full h-full object-cover object-right opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Gem className="w-4 h-4 text-primary" />
            <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary">
              Fragrance Expertise
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-foreground mb-6">
            Never Get a{' '}
            <span className="text-primary">Fragrance Gift</span>{' '}
            Wrong Again
          </h1>
          <p className="font-body text-base md:text-lg text-foreground/75 leading-relaxed mb-8 max-w-lg font-light tracking-wide">
            We've spent years developing our fragrance expertise so you don't have to. Just answer a few questions and leave the rest to us.
          </p>
          {/* Route pills */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <Button
              onClick={() => handleRoute('gift')}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Find The Perfect Gift
            </Button>
            <Button
              onClick={() => handleRoute('self')}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
            >
              <Feather className="w-4 h-4" />
              Discover Your Next Favourite
            </Button>
          </div>
          <p className="text-xs text-primary font-body font-medium mb-3">
            Premium scent match • £4.99
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-foreground/60 font-body">"Finally found a fragrance he actually loves." - Sarah M., Manchester</span>
          </div>
        </motion.div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce opacity-60">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
