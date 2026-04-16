import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle, Feather } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const premiumFeatures = [
  "Instant results",
  "3 personalised fragrance recommendations",
  "Safe Match, Statement Choice & Wildcard Discovery",
  "Designer, Niche & Middle Eastern options",
  "Match scoring for added confidence",
  "Suitability reasoning",
  "Optional emailable copy for future reference",
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Answer a few thoughtful questions",
    description: "Tell us about the person — their personality, style, occasion, and scent preferences. A few quick questions, done in minutes. No fragrance knowledge needed.",
  },
  {
    step: "02",
    title: "We curate the match",
    description: "Your answers are carefully interpreted and matched against our verified fragrance catalogue — every result is a real, purchasable fragrance selected around their profile.",
  },
  {
    step: "03",
    title: "Receive three tailored recommendations",
    description: "Receive three tailored recommendations: a Safe Match, a Statement Choice, and a Wildcard Discovery, each with a confidence score, why it suits them, and why they'll love it.",
  },
  {
    step: "04",
    title: "Gift with complete confidence",
    description: "Know exactly why each scent fits and why it will resonate emotionally. Turn your gift into a memory they'll never forget.",
  },
];

export default function PathsSection() {
  return (
    <section id="how-it-works" className="py-16 px-6 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            How it works
          </h2>
        </motion.div>

        {/* How It Works Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {howItWorksSteps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col bg-card border border-border/40 rounded-2xl p-6"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-heading text-sm text-primary font-medium">{s.step}</span>
              </div>
              <h3 className="font-heading text-base text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>

        {/* PREMIUM CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          id="premium-match"
          className="relative bg-card border border-primary/30 rounded-3xl p-8 overflow-hidden max-w-md mx-auto w-full scroll-mt-24"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs font-body font-medium tracking-[0.2em] uppercase text-primary block mb-0.5">⭐ Most popular</span>
              <h3 className="font-heading text-xl text-foreground">Premium gift scent match</h3>
            </div>
          </div>

          <ul className="space-y-2.5 mb-8">
            {premiumFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground font-body">{f}</span>
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-12 w-full">
            <Link to="/quiz" state={{ route: 'gift' }}>
              <Sparkles className="w-4 h-4 mr-2" />
              Unlock the Perfect Match
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <p className="text-center text-xs text-muted-foreground font-body mt-4">
            £4.99 One time payment • No subscription
          </p>
          <div className="text-center mt-4 pt-4 border-t border-border/30">
            <Link
              to="/quiz"
              state={{ route: 'self' }}
              className="inline-flex items-center gap-2 text-sm font-body text-foreground/70 hover:text-primary transition-colors group"
            >
              <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Also available:</span>
              <Feather className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary transition-colors" />
              <span className="font-medium">Discover your next favourite →</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}