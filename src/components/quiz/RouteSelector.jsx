import React from 'react';
import { motion } from 'framer-motion';
import { Gift, User, ArrowRight } from 'lucide-react';

export default function RouteSelector({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-4 block">
            The Scent Match
          </span>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-3 leading-tight">
            Who is this fragrance match for?
          </h1>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            We'll tailor every question to match who you're shopping for.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelect('gift')}
            className="w-full group bg-card border border-primary/30 hover:border-primary/60 rounded-2xl p-6 text-left transition-all hover:bg-card/80"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg text-foreground mb-1">A gift for someone else</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Find the perfect fragrance for a partner, friend, family member, or colleague.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
            </div>
          </button>

          <button
            onClick={() => onSelect('self')}
            className="w-full group bg-card border border-border/40 hover:border-primary/40 rounded-2xl p-6 text-left transition-all hover:bg-card/80"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg text-foreground mb-1">For me</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Discover your own perfect signature scent — something new, or an upgrade on what you love.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}