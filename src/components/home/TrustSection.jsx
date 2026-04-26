import React from 'react';
import { Shield, Heart, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  {
    icon: Shield,
    title: "Stop second-guessing",
    description: "Each recommendation includes a confidence score and clear expert reasoning, so you can gift with confidence."
  },
  {
    icon: Heart,
    title: "Avoid expensive misses",
    description: "Reduce the risk of buying a fragrance they'll never wear. Our matching considers personality, taste, and occasion- turning a risky purchase into a memorable moment."
  },
  {
    icon: Globe,
    title: "Go beyond the high street",
    description: "We help you find standout designer, niche, and Middle Eastern fragrances beyond the usual choices, tailored to them so your gift feels more thoughtful and genuinely exciting."
  },
  {
    icon: Sparkles,
    title: "Skip the shop overwhelm",
    description: "No confusing counters, fragrance fatigue, or endless testing. Get clear, personalised recommendations in minutes- without the stress of the fragrance hall."
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
            Fragrance is deeply personal. Our expert matching goes beyond bestseller lists to find the scent that feels uniquely right, making the choice feel effortless.
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
