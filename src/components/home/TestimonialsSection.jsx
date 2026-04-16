import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Seed testimonials — can later be replaced with DB-fetched entries
const SEED_TESTIMONIALS = [
  {
    id: 1,
    author_name: "Sophie R.",
    location: "London, UK",
    quote: "I bought my husband the Layton recommendation and he wore it every single day for three months — the best fragrance gift I've ever given.",
    star_rating: 5,
    outcome_tag: "got-it-right",
  },
  {
    id: 2,
    author_name: "Amelia T.",
    location: "London, UK",
    quote: "Neither of us had ever heard of BDK Parfums before, but now Gris Charnel is her favourite scent. The Scent Match introduced us both to something completely new.",
    star_rating: 5,
    outcome_tag: "discovered-new-brand",
  },
  {
    id: 3,
    author_name: "Marcus L.",
    location: "London, UK",
    quote: "Saved me from wasting £120 on the wrong bottle. Got the perfect match for my girlfriend in under five minutes. She was genuinely shocked I got it so right.",
    star_rating: 5,
    outcome_tag: "saved-money",
  },
  {
    id: 4,
    author_name: "Priya K.",
    location: "Birmingham, UK",
    quote: "The match was spot on. I'll definitely be using this service again and have already recommended it to others.",
    star_rating: 5,
    outcome_tag: "gift-remembered",
  },
  {
    id: 5,
    author_name: "Claire W.",
    location: "Dublin, IE",
    quote: "The Middle Eastern recommendation was a revelation — I never would have found Afnan 9PM on my own and it turned into the surprise hit of the year.",
    star_rating: 5,
    outcome_tag: "surprised-recipient",
  },
  {
    id: 6,
    author_name: "Daniel F.",
    location: "Bristol, UK",
    quote: "I've tried buying perfumes as gifts before, but never felt confident in my choice. The Scent Match really helped me get it right and feel confident about what I picked. They absolutely loved it.",
    star_rating: 5,
    outcome_tag: "got-it-right",
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials }) {
  const items = (testimonials && testimonials.length > 0) ? testimonials : SEED_TESTIMONIALS;

  return (
    <section id="reviews" className="py-20 px-6 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-4 block">
            Real Results
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4 leading-tight">
            A few of our favourite gifting success stories
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            The Scent Match customers who got it beautifully right.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-primary/20 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              <StarRow />

              <p className="text-sm text-foreground font-heading italic font-normal leading-relaxed flex-1">
                "{t.quote}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div>
                  <p className="text-xs font-body font-medium text-foreground">{t.author_name}</p>
                  {t.location && (
                    <p className="text-xs text-muted-foreground font-body">{t.location}</p>
                  )}
                </div>
                {t.outcome_tag && (
                  <span className="text-xs font-body text-primary/70 capitalize bg-primary/5 px-2 py-0.5 rounded-full">
                    {t.outcome_tag.replace(/-/g, ' ')}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}