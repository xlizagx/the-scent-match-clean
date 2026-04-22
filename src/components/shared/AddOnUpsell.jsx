import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Feather, ArrowRight } from 'lucide-react';

export default function AddOnUpsell({ onUnlockGift, onUnlockSelf }) {
  const [stage, setStage] = useState('idle'); // idle | route

  const handleRouteSelect = (selected) => {
    if (selected === 'gift') {
      onUnlockGift();
    } else {
      onUnlockSelf();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative bg-card border border-primary/20 rounded-2xl p-7 mt-10 overflow-hidden"
    >
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">

        {/* IDLE */}
        {stage === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs font-body font-medium tracking-wider uppercase text-primary block mb-1">
                  Exclusive Add-On
                </span>
                <h3 className="font-heading text-xl text-foreground leading-tight">
                  Want another round of recommendations?
                </h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
              Unlock another beautifully curated round for just £1.99 — a different direction, another occasion, or someone entirely new.
            </p>

            <div className="flex items-center gap-3 mb-5 p-4 bg-primary/5 border border-primary/15 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground font-body">One-time add-on</p>
                <p className="font-heading text-2xl text-foreground">£1.99</p>
              </div>
              <div className="ml-auto">
                <p className="text-xs text-primary font-body font-medium text-right">One more,</p>
                <p className="text-xs text-primary font-body font-medium text-right">beautifully matched</p>
              </div>
            </div>

            <Button
              onClick={() => setStage('route')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-11 w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Unlock Another Round — £1.99
            </Button>
            <p className="text-center text-xs text-muted-foreground font-body mt-3">One-time payment · No subscription</p>
          </motion.div>
        )}

        {/* ROUTE SELECTION */}
        {stage === 'route' && (
          <motion.div key="route" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h3 className="font-heading text-xl text-foreground mb-2">What would you like to do next?</h3>
            <p className="text-sm text-muted-foreground font-body mb-6 leading-relaxed">
              Choose your next match — a fresh gift recommendation or your own next favourite.
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleRouteSelect('gift')}
                className="w-full text-left bg-secondary/40 hover:bg-secondary/70 border border-border/50 hover:border-primary/30 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">Find Another Perfect Gift</p>
                    <p className="text-xs text-muted-foreground font-body">Fresh questionnaire for a new or existing person</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
                </div>
              </button>

              <button
                onClick={() => handleRouteSelect('self')}
                className="w-full text-left bg-secondary/40 hover:bg-secondary/70 border border-border/50 hover:border-primary/30 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Feather className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">Discover Your Next Favourite</p>
                    <p className="text-xs text-muted-foreground font-body">Find your own perfect signature scent</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
                </div>
              </button>
            </div>

            <button
              onClick={() => setStage('idle')}
              className="text-xs text-muted-foreground font-body hover:text-foreground transition-colors w-full text-center"
            >
              Cancel
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
