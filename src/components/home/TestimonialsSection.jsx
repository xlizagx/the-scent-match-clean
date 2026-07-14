import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const SEED_TESTIMONIALS = [
  {
    id: 1,
    author_name: "Sophie R.",
    location: "London, UK",
    quote: "Bought my husband the Layton recommendation. He's worn it almost every day since. First time I've felt confident buying a fragrance gift.",
    star_rating: 5,
    outcome_tag: "got it right",
  },
  {
    id: 2,
    author_name: "Amelia T.",
    location: "Manchester, UK",
    quote: "Had never heard of BDK Gris Charnel but now it's her everyday scent. Genuinely wouldn't have found it without this.",
    star_rating: 5,
    outcome_tag: "new favourite",
  },
  {
    id: 3,
    author_name: "Marcus L.",
    location: "Edinburgh, UK",
    quote: "Saved me from walking around the shops stressed. Got a match for my girlfriend's birthday in minutes - she was so surprised I 'chose it myself' ;)",
    star_rating: 5,
    outcome_tag: "saved money",
  },
  {
    id: 4,
    author_name: "Priya K.",
    location: "Birmingham, UK",
    quote: "They suggested Narciso Rodriguez For Her. She has worn it constantly. Will 100% use again.",
    star_rating: 5,
    outcome_tag: "got it right",
  },
  {
    id: 5,
    author_name: "Daniel F.",
    location: "Leeds, UK",
    quote: "Always nervous buying perfume as a gift. Went with the Safe Match recommendation - Chanel Eau Tendre - and she loved it. Worth every penny.",
    star_rating: 5,
    outcome_tag: "got it right",
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials }) {
  const items = (testimonials && testimonials.length > 0) ? testimonials : SEED_TESTIMONIALS;

  return (
    <section id="reviews" className="pt-6 pb-12 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-3 block">
            Real Results
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3 leading-tight">
            A few of our favourite gifting success stories
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            The Scent Match customers who got it beautifully right.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
          {items.map((t, i) => (
            <motion.div
              key={t.id || i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-3"
            >
              <div className="w-0.5 bg-primary/40 flex-shrink-0 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <StarRow />
                <p className="text-foreground font-heading italic font-normal leading-relaxed" style={{ fontSize: "0.8125rem" }}>
                  "{t.quote}"
                </p>
                <p className="text-xs font-body text-muted-foreground">
                  {t.author_name}{t.location ? ` - ${t.location}` : ""}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
