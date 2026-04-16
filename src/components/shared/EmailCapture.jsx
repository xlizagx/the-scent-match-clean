import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function EmailCapture({ results, profile, quizContext }) {
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);

    // Generate premium email-friendly results via LLM
    const recsList = results.map((r, i) => {
      const tiers = ['Safe Choice', 'Exciting Choice', 'Unexpected Wow'];
      return `${tiers[i]}: ${r.fragrance_name} by ${r.brand}\nSmells like: ${r.smells_like}\nWhy they'll love this: ${r.why_this_works}\nMatch confidence: ${r.confidence_score}%`;
    }).join('\n\n');

    const profileSummary = profile
      ? `Recipient personality: ${profile.summary}\nTraits: ${profile.traits?.join(', ')}`
      : '';

    const emailBody = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a premium fragrance gifting concierge writing a beautiful, warm email on behalf of The Scent Match (thescentmatch.com).

Write a well-structured, elegant HTML email body (no full HTML document — just the inner body content) for a customer who just received their personalised fragrance gift recommendations.

RECIPIENT PROFILE:
${profileSummary}

QUIZ CONTEXT:
${quizContext || 'No additional context'}

RECOMMENDATIONS:
${recsList}

The email should:
- Open warmly, thanking them for trusting The Scent Match with their gifting
- Present each of the 3 recommendations clearly with a short summary, smells-like description, and why it suits the recipient
- Note which is the safe choice, exciting choice, and wow choice
- Include gifting notes (e.g. "perfect for an evening occasion", "a great first impression")
- Encourage them to revisit anytime and save for future gifting moments
- Close warmly in a boutique concierge tone, signed "The Scent Match Team"

Format as clean HTML with inline styles (no CSS classes). Use a dark background (#0a0a0a), warm gold (#C9A84C) accents, serif headings, and readable sans-serif body text.`,
    });

    await base44.integrations.Core.SendEmail({
      to: email,
      subject: "Your Personalised Fragrance Matches — The Scent Match",
      body: typeof emailBody === 'string' ? emailBody : JSON.stringify(emailBody),
    });

    setSent(true);
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