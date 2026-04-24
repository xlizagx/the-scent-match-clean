import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

export default function EmailCapture({ results, profile, quizContext }) {
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          optIn,
          results,
          profile,
          quizContext,
        }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setSending(false);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-primary/20 rounded-2xl p-6 text-center mt-8"
      >
        <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
        <p className="font-heading text-lg text-foreground mb-1">Sent to your inbox</p>
        <p className="text-xs text-muted-foreground font-body">Your personalised matches are on their way. Check your email to revisit or shop later.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-primary/20 rounded-2xl p-6 mt-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Mail className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-heading text-base text-foreground">Keep your matches for later</p>
          <p className="text-xs text-muted-foreground font-body">Optional — your results are already on screen above</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-body leading-relaxed mb-5">
        Send this personalised gift match to your email so you can revisit it anytime, shop later, or keep it for future gifting moments.
      </p>

      <form onSubmit={handleSend} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="bg-secondary border-border/50 rounded-xl h-11 font-body text-sm"
        />

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optIn}
            onChange={e => setOptIn(e.target.checked)}
            className="mt-0.5 accent-primary w-4 h-4 shrink-0"
          />
          <span className="text-xs text-muted-foreground font-body leading-relaxed">
            Yes, I'd love to receive occasional gifting ideas and new fragrance launches from The Scent Match
          </span>
        </label>

        {error && (
          <p className="text-xs text-red-500 font-body">{error}</p>
        )}

        <Button
          type="submit"
          disabled={sending || !email}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-11 w-full"
        >
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending your matches...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Email My Recommendations
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground font-body">
          Optional · No account needed · Unsubscribe anytime
        </p>
      </form>
    </motion.div>
  );
}
