import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Star } from 'lucide-react';

const MATCHES = [
  {
    tier: 'safe',
    label: 'Safe Match',
    icon: ShieldCheck,
    badgeBg: 'rgba(52,211,153,0.15)',
    badgeBorder: 'rgba(52,211,153,0.3)',
    badgeColor: '#34d399',
    border: 'border-emerald-400/20',
    image: '/safe.jpg',
    objectPosition: 'center center',
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
    badgeBg: 'rgba(251,191,36,0.15)',
    badgeBorder: 'rgba(251,191,36,0.3)',
    badgeColor: '#fbbf24',
    border: 'border-amber-400/20',
    image: '/statement.jpg',
    objectPosition: 'center center',
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
    badgeBg: 'rgba(167,139,250,0.15)',
    badgeBorder: 'rgba(167,139,250,0.3)',
    badgeColor: '#a78bfa',
    border: 'border-violet-400/20',
    image: '/wildcard.jpg',
    objectPosition: 'center center',
    name: 'Mystic Incense',
    brand: 'The Merchant of Venice',
    confidence: 82,
    smells_like: 'sticky caramel, dark cacao, smoky incense, dried fruits, warm white woods',
    why_this_suits: 'It gives their gourmand preference an unexpected smoky-sacred lift - bold enough for a confident personality without straying from the sweet warmth they gravitate toward.',
  },
];

export default function RecentMatches() {
  return (
    <section className="pt-12 pb-10 px-6">
      <div className="max-w-5xl mx-auto mb-10">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

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
            Real results. Real matches.
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            A glimpse into what could be waiting on the other side.
          </p>
        </motion.div>

        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingRight: '40px',
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
                style={{ width: '300px', minWidth: '300px', maxWidth: '300px' }}
              >
                <div className="relative overflow-hidden" style={{ height: '220px', flexShrink: 0 }}>
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: match.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" />
                  <div
                    className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{
                      background: 'rgba(0,0,0,0.55)',
                      border: `1px solid ${match.badgeBorder}`,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <Icon className="w-3 h-3 flex-shrink-0" style={{ color: match.badgeColor }} />
                    <span className="text-xs font-body font-semibold tracking-wider uppercase" style={{ color: match.badgeColor }}>
                      {match.label}
                    </span>
                  </div>
                  <div
                    className="absolute top-3 right-3 text-xs font-body font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(0,0,0,0.65)',
                      border: `1px solid ${match.badgeBorder}`,
                      color: match.badgeColor,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {match.confidence}% match
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div style={{ minHeight: '44px' }}>
                    <h3 className="font-heading text-lg text-foreground leading-tight">{match.name}</h3>
                    <p className="text-xs text-muted-foreground font-body">{match.brand}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-3" style={{ minHeight: '95px' }}>
                    <span className="text-xs font-body font-medium tracking-wider uppercase text-muted-foreground block mb-1">
                      Smells Like
                    </span>
                    <p className="text-xs text-foreground font-body leading-relaxed">{match.smells_like}</p>
                  </div>
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
      </div>
    </section>
  );
}
