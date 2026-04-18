import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, CreditCard, Smartphone, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckoutScreen({ onPurchase, onBack, price = "£4.99", label = "Unlock your 3 individually matched fragrance recommendations" }) {
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState(null);

  const handlePay = async (selectedMethod) => {
    setMethod(selectedMethod);
    setProcessing(true);
    // Simulate payment processing — replace with real Stripe/Apple Pay/Google Pay integration
    await new Promise(r => setTimeout(r, 1400));
    setProcessing(false);
    onPurchase();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full"
      >
        {/* Back */}
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

        {/* Payment methods */}
        <div className="space-y-3">
          {/* Apple Pay / Google Pay */}
          <Button
            onClick={() => handlePay('apple')}
            disabled={processing}
            className="w-full h-13 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-body text-sm font-medium flex items-center justify-center gap-2"
          >
            {processing && method === 'apple' ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                Pay with Apple Pay
              </>
            )}
          </Button>

          <Button
            onClick={() => handlePay('google')}
            disabled={processing}
            variant="outline"
            className="w-full h-13 rounded-xl border-border/60 font-body text-sm font-medium flex items-center justify-center gap-2"
          >
            {processing && method === 'google' ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <span className="text-base">G</span>
                Pay with Google Pay
              </>
            )}
          </Button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted-foreground font-body">or pay by card</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Card form (simulated — replace input fields with Stripe Elements) */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-body text-muted-foreground uppercase tracking-wider">Card Number</label>
              <div className="bg-secondary rounded-xl h-11 px-3 flex items-center gap-2 border border-border/40">
                <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground font-body">•••• •••• •••• ••••</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider">Expiry</label>
                <div className="bg-secondary rounded-xl h-11 px-3 flex items-center border border-border/40">
                  <span className="text-sm text-muted-foreground font-body">MM / YY</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider">CVC</label>
                <div className="bg-secondary rounded-xl h-11 px-3 flex items-center border border-border/40">
                  <span className="text-sm text-muted-foreground font-body">•••</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => handlePay('card')}
              disabled={processing}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-12 w-full"
            >
              {processing && method === 'card' ? (
                <span className="animate-pulse">Processing payment...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Unlock the Perfect Match
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-body">Secured by Stripe · SSL encrypted</p>
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
