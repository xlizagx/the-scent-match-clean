import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function CheckoutScreen({ onBack, price = "£4.99", label = "Unlock your 3 individually matched fragrance recommendations", isAddon = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAddon })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground font-body hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to review
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-xs font-body font-semibold text-primary tracking-wider uppercase">Instant results</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs font-body font-semibold text-primary tracking-wider uppercase">No subscription</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs font-body font-semibold text-primary tracking-wider uppercase">One-time only</span>
          </div>
          <h2 className="font-heading text-2xl text-foreground mb-2 leading-tight">
            Unlock the perfect match
          </h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 max-w-xs mx-auto">
            A small one-time payment for a fragrance choice they'll remember, thoughtfully curated.
          </p>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="font-heading text-5xl text-foreground">{price}</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4 font-body">{error}</p>
        )}

        <Button
          onClick={handlePay}
          disabled={loading}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-12 w-full mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Preparing payment...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Pay {price} — Unlock My Matches
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 mt-5">
          <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-body">Secured by Stripe · Apple Pay & Google Pay accepted</p>
        </div>

        <div className="text-center mt-4">
          <a href="/support#how-it-works" className="text-xs text-muted-foreground font-body hover:text-primary transition-colors underline underline-offset-2">
            How does it work?
          </a>
        </div>
      </motion.div>
    </div>
  );
}
