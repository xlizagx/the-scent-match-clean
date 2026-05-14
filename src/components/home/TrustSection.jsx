import React from 'react';
import { Shield, Heart, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  {
    icon: Shield,
    title: "No expertise needed",
    description: "You don't need to know a thing about fragrance. That's our job. We ask the right questions and do the matching for you."
  },
  {
    icon: Heart,
    title: "No expensive mistakes",
    description: "Getting it wrong isn't just costly - it'll be a gift they never mention again. Every recommendation comes with clear reasoning and a confidence score - so you know exactly why it's right."
  },
  {
    icon: Globe,
    title: "Beyond just the high street",
    description: "With over 69,000 fragrances curated by specialists, we'll find something truly special - from designer to niche to Middle Eastern."
  },
  {
    icon: Sparkles,
    title: "Matched to them, not the masses",
    description: "This isn't a bestseller list. It's a recommendation built around who they actually are - their personality, their taste, their world."
  }
];

export default function TrustSection() {
  return (
    <section className="py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-4 block">
            Why The Scent Match
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-6 leading-tight">
            We help you get fragrance gifting right
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto leading-relaxed">
            Fragrance is personal. Our specialist matching goes beyond bestseller lists to find the scent that feels uniquely right - making the choice feel effortless. Treating yourself? It works just as well.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 mx-auto">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-base text-foreground mb-2 text-center">{item.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed text-center">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
