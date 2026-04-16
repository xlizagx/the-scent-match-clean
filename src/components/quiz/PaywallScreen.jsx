import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  "Intelligent scent profile",
  "Deep personality & style profiling",
  "Three curated tiers: Safe, Exciting & Wow",
  "Confidence scores with detailed explanations",
  "Easy-to-understand scent descriptions",
  "Highly rated recommendations designed for thoughtful gift matches",
  "Regional buy links for UK, Europe & US",
  "Optional email copy of your personalised fragrance recommendations so you can revisit them anytime",
];

export default function PaywallScreen({ onUnlock }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Lock className="w-7 h-7 text-primary" />
        </div>

        <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-4 block">
          Premium Scent Match
        </span>

        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4 leading-tight">
          Find the Fragrance They'll Remember Forever
        </h1>

        <p className="text-muted-foreground font-body text-sm mb-8 leading-relaxed">
          Our guided personality quiz creates an intelligent scent profile and delivers three expertly matched recommendations — so you can gift with absolute confidence.
        </p>

        <div className="bg-card border border-border/50 rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="font-heading text-lg text-foreground">What's Included</span>
            <Badge className="bg-primary/10 text-primary border-primary/20 font-body text-xs">
              One-Time
            </Badge>
          </div>
          <ul className="space-y-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground font-body">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-2">
          <span className="font-heading text-4xl text-foreground">£4.99</span>
          <span className="text-muted-foreground font-body text-sm ml-2">one-time</span>
        </div>
        <p className="text-xs text-muted-foreground font-body mb-4">Instant results · No subscription · One-time payment</p>

        <Button
          onClick={onUnlock}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-10 h-12 w-full mb-4"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Unlock Premium Match
        </Button>

        <Button asChild variant="ghost" className="text-muted-foreground font-body text-sm">
          <Link to="/match">
            Or get your free basic match instead
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  );
}