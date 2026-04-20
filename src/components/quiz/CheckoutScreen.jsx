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
          <h2 className="font-heading​​​​​​​​​​​​​​​​
