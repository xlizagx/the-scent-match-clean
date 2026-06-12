import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Star } from 'lucide-react';

const MATCHES = [
  {
    tier: 'safe',
    label: 'Safe Match',
    icon: ShieldCheck,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    image: '/safe.jpg',
    name: 'Aqua Celestia Forte',
    brand: 'Maison Francis Kurkdjian',
    confidence: 88,
    smells_like: 'cold lime zest, fresh mint, dewy black currant blossom, soft white jasmine, green mimosa',
    why_this_suits: 'For someone quietly confident and fresh-leaning - this is clean, considered and effortless. The kind of scent that surprises gently rather than overwhelms.',
  },
  {
    tier: 'statement',
    label: 'Statement Choice',
    icon: Zap,
    accent: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    image: '/statement.jpg',
    name: 'Rose Gold',
    brand: 'Ormonde Jayne',
    confidence: 91,
    smells_like: 'bright bergamot and lime, rich Taif rose, woody oud, soft carnation, warm sandalwood',
    why_this_suits: 'A sophisticated rose-oud floral with real character - designed to be noticed on their terms, not imposed on a room.',
  },
  {
    tier: 'wildcard',
    label: 'Wildcard Discovery',
    icon: Star,
    accent: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    image: '/wildcard.jpg',
    name: 'Mystic Incense',
    brand: 'The Merchant of Venice',
    confidence: 82,
    smells_like: 'sticky caramel, dark cacao, smoky incense, dried fruits, warm white woods',
    why_this_suits: 'It gives their gourmand preference an unexpected smoky-sacred lift - bold enough for a confident personality without straying from the sweet warmth they gravitate toward.',
  },
];

export default function RecentMatches() {
  return (
    <section className="py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-3 block">
            Recent Matches
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3 leading-tight">
            This is what your match looks like
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            Real recommendations from real quizzes - three tiers, every time.
          </p>
        </motion.div>

        {/* Scrollable strip */}
        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingRight: '24px',
          }}
        >
          {MATCHES.map((match, i) => {
            const Icon = match.icon;
            return (
              <motion.div
                key={match.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card border ${match.border} rounded-2xl overflow-hidden flex-shrink-0 snap-start flex flex-col`}
                style={{ width: '300px' }}
              >
                {/* Bottle image - fixed height */}
                <div className="relative overflow-hidden" style={{ height: '220px' }}>
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  {/* Tier badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-md ${match.bg} flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${match.accent}`} />
                    </div>
                    <span className={`text-xs font-body font-semibold tracking-wider uppercase ${match.accent}`}>
                      {match.label}
                    </span>
                  </div>
                  {/* Confidence score */}
                  <div className={`absolute top-3 right-3 text-xs font-body font-medium px-2 py-0.5 rounded-full border ${match.border} ${match.accent} bg-card/80`}>
                    {match.confidence}% match
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  {/* Name - below image */}
                  <div>
                    <h3 className="font-heading text-lg text-foreground leading-tight">{match.name}</h3>
                    <p className="text-xs text-muted-foreground font-body">{match.brand}</p>
                  </div>

                  {/* Smells like */}
                  <div className="bg-secondary/50 rounded-xl p-3">
                    <span className="text-xs font-body font-medium tracking-wider uppercase text-muted-foreground block mb-1">
                      Smells Like
                    </span>
                    <p className="text-xs text-foreground font-body leading-relaxed">{match.smells_like}</p>
                  </div>

                  {/* Why this suits */}
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex-1">
                    <span className="text-xs font-body font-medium tracking-wider uppercase text-primary block mb-1">
                      Why this suits them
                    </span>
                    <p className="text-xs text-foreground font-body leading-relaxed">{match.why_this_suits}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-4 italic">
          Swipe to see all three tiers - Safe, Statement and Wildcard.
        </p>
      </div>
    </section>
  );
}
