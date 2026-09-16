import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Sparkles, Feather, Star, Lightbulb, Clock, BookOpen, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const badges = [
  { icon: BookOpen, label: 'Just a Few Quick Questions' },
  { icon: Star, label: '3 Expert Picks' },
  { icon: Lightbulb, label: 'Insights Into Why They Work' },
  { icon: Clock, label: 'Only £4.99 • Instant Results' },
];

export default function FindAScentMatch() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/shop-hero.png"
          alt="Perfume bottles and gift box styled together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Gem className="w-4 h-4 text-primary" />
            <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary">
              Fragrance Expertise
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-foreground mb-5">
            Never Get a Fragrance<br />
            <span className="text-primary">Gift Wrong Again.</span>
          </h1>

          <p className="font-body text-sm md:text-base text-foreground/75 leading-relaxed tracking-wide mb-7 max-w-md">
            <span className="text-primary font-medium">
              Built from fragrance expertise. Refined through extensive testing. Designed around you.
            </span>
          </p>

          <div className="grid grid-cols-2 gap-2.5 mb-7 max-w-md">
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(var(--primary-rgb, 212,175,55), 0.3)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-[11px] font-body text-foreground/85 leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-3">
            <div className="flex flex-col items-start gap-1 w-full">
              <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-primary px-2">
                Most Popular
              </span>

              <Button
                asChild
                size="lg"
                className="w-full sm:w-72 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
              >
                <Link to="/quiz?type=gift">
                  <Sparkles className="w-4 h-4" />
                  Find The Perfect Scent Match
                </Link>
              </Button>
            </div>

            <div className="flex flex-col items-start gap-1 w-full">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-72 bg-transparent border-primary text-primary hover:bg-primary/10 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
              >
                <Link to="/quiz?type=self">
                  <Feather className="w-4 h-4" />
                  Discover Your Next Favourite
                </Link>
              </Button>
            </div>
          </div>

          <p className="font-body text-sm text-foreground/50 italic tracking-wide mb-5">
            Takes 2 minutes. Works even for the people you can never buy for.
          </p>

          <div
            className="mt-2 rounded-xl px-4 py-4 max-w-md"
            style={{
              background: 'linear-gradient(145deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
              border: '1px solid rgba(212,175,55,0.5)',
              boxShadow: '0 4px 20px rgba(212,175,55,0.15)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-primary">
                New Customer Offer
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-body text-sm text-foreground/75">
                First time here? Try it for half price. Use code
              </span>

              <span
                className="font-body text-sm font-bold tracking-widest text-primary px-2 py-0.5 rounded"
                style={{ background: 'rgba(212,175,55,0.15)' }}
              >
                FIRSTMATCH50
              </span>

              <span className="font-body text-sm text-foreground/75">
                at checkout.
              </span>
            </div>

            <p className="font-body text-xs text-foreground/50 italic mt-2">
              Quiz only - not valid on shop items.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
