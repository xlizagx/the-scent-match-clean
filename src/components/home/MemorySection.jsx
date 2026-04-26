import React from 'react';
import { motion } from 'framer-motion';

export default function MemorySection({ memoryImage }) {
  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img
                src={memoryImage}
                alt="Premium fragrance collection arranged artfully"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-4 block">
              The Science of Scent
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-6 leading-tight">
              Fragrance Creates Memories That Last Forever
            </h2>
            <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
              <p>
                A single note can transport someone back to their favourite moment- a summer evening, a first date, a feeling of pure joy.
              </p>
              <p>
                Scent is the only sense directly linked to the brain's memory and emotion centres.
              </p>
              <p>
                When you gift the right fragrance, you're not just giving a bottle. You're creating a memory they'll carry with them every time they wear it.
              </p>
              <p className="text-foreground font-medium italic font-heading text-lg">
                "Find the fragrance they'll remember forever."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
