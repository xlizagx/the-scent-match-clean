import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Sparkles, Feather, Star, Lightbulb, Clock, BookOpen, Tag, ShieldCheck, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const badges = [
  { icon: BookOpen, label: 'Just a Few Quick Questions' },
  { icon: Star, label: '3 Expert Picks' },
  { icon: Lightbulb, label: 'Insights Into Why They Work' },
  { icon: Clock, label: 'Only £4.99 • Instant Results' },
];

const PREVIEW_MATCHES = [
  {
    label: 'Safe Match',
    icon: ShieldCheck,
    badgeColor: '#34d399',
    badgeBg: 'rgba(52,211,153,0.08)',
    badgeBorder: 'rgba(52,211,153,0.15)',
    confidenceBg: 'rgba(52,211,153,0.15)',
    confidenceBorder: 'rgba(52,211,153,0.3)',
    cardBorder: 'rgba(52,211,153,0.2)',
    image: '/safe.jpg',
    objectPosition: 'center center',
    name: 'Aqua Celestia Forte',
    brand: 'Maison Francis Kurkdjian',
    confidence: 88,
    smells_like: 'cold lime zest, fresh mint, dewy black currant blossom',
    why_this_suits: 'Clean, considered and effortless - surprises gently rather than overwhelms.',
  },
  {
    label: 'Statement Choice',
    icon: Zap,
    badgeColor: '#fbbf24',
    badgeBg: 'rgba(251,191,36,0.08)',
    badgeBorder: 'rgba(251,191,36,0.15)',
    confidenceBg: 'rgba(251,191,36,0.15)',
    confidenceBorder: 'rgba(251,191,36,0.3)',
    cardBorder: 'rgba(251,191,36,0.2)',
    image: '/statement.jpg',
    objectPosition: 'center center',
    name: 'Rose Gold',
    brand: 'Ormonde Jayne',
    confidence: 91,
    smells_like: 'bright bergamot and lime, rich Taif rose, woody oud',
    why_this_suits: 'Designed to be noticed on their terms, not imposed on a room.',
  },
  {
    label: 'Wildcard Discovery',
    icon: Star,
    badgeColor: '#a78bfa',
    badgeBg: 'rgba(167,139,250,0.08)',
    badgeBorder: 'rgba(167,139,250,0.15)',
    confidenceBg: 'rgba(167,139,250,0.15)',
    confidenceBorder: 'rgba(167,139,250,0.3)',
    cardBorder: 'rgba(167,139,250,0.2)',
    image: '/wildcard.jpg',
    objectPosition: 'center 30%',
    name: 'Mystic Incense',
    brand: 'The Merchant of Venice',
    confidence: 82,
    smells_like: 'sticky caramel, dark cacao, smoky incense, warm white woods',
    why_this_suits: 'Bold enough for a confident personality without straying from sweet warmth.',
  },
];

export default function HeroWithMatches({ heroImage }) {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = React.useState(0);
  const match = PREVIEW_MATCHES[activeCard];
  const Icon = match.icon;

  const handleRoute = (route) => {
    navigate('/quiz', { state: { route } });
  };

  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury perfume bottle in warm golden light"
          className="w-full h-full object-cover object-right opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left - hero text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 max-w-xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Gem className="w-4 h-4 text-primary" />
              <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary">
                Fragrance Expertise
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-foreground mb-6">
              The Smarter Way<br />
              <span className="text-primary">to Gift Fragrance.</span>
            </h1>

            <p className="font-body text-base md:text-lg text-foreground/75 leading-relaxed mb-8 max-w-lg font-light tracking-wide">
              Just tell us about them... we'll do the rest.<br />Finding something for yourself? We've got that too.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {badges.map(({ icon: BadgeIcon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-center"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                    border: '1px solid rgba(var(--primary-rgb, 212,175,55), 0.35)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <BadgeIcon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs font-body text-foreground/90 leading-snug">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
                <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-primary px-2">
                  Most Popular
                </span>
                <Button
                  onClick={() => handleRoute('gift')}
                  size="lg"
                  className="w-72 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Find The Perfect Gift
                </Button>
              </div>
              <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
                <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-transparent px-2">&nbsp;</span>
                <Button
                  onClick={() => handleRoute('self')}
                  size="lg"
                  variant="outline"
                  className="w-72 bg-transparent border-primary text-primary hover:bg-primary/10 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
                >
                  <Feather className="w-4 h-4" />
                  Discover Your Next Favourite
                </Button>
              </div>
            </div>

            <p className="font-body text-sm text-foreground/50 italic tracking-wide mb-6">
              Takes 2 minutes. Works even for the people you can never buy for.
            </p>

            <div
              className="mt-2 rounded-xl px-4 py-4"
              style={{
                background: 'linear-gradient(145deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                border: '1px solid rgba(212,175,55,0.5)',
                boxShadow: '0 4px 20px rgba(212,175,55,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-primary" />
                <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-primary">
                  New Customer Offer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-foreground/75">First time here? Try it for half price. Use code</span>
                <span
                  className="font-body text-sm font-bold tracking-widest text-primary px-2 py-0.5 rounded"
                  style={{ background: 'rgba(212,175,55,0.15)' }}
                >
                  FIRSTMATCH50
                </span>
                <span className="font-body text-sm text-foreground/75">at checkout.</span>
              </div>
            </div>
          </motion.div>

          {/* Right - preview card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="w-full lg:w-[300px] flex-shrink-0"
          >
            <p className="text-xs font-body font-medium tracking-[0.2em] uppercase text-primary mb-3 text-center lg:text-left">
              Example Results
            </p>

            {/* Card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${match.cardBorder}` }}
            >
              {/* Header bar */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ background: match.badgeBg, borderBottom: `1px solid ${match.badgeBorder}` }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" style={{ color: match.badgeColor }} />
                  <span className="text-xs font-body font-semibold tracking-wider uppercase" style={{ color: match.badgeColor }}>
                    {match.label}
                  </span>
                </div>
                <div
                  className="text-xs font-body font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: match.confidenceBg, border: `1px solid ${match.confidenceBorder}`, color: match.badgeColor }}
                >
                  {match.confidence}% match
                </div>
              </div>

              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: '180px' }}>
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: match.objectPosition }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />
              </div>

              {/* Body */}
              <div className="bg-card p-4 flex flex-col gap-3">
                <div>
                  <h3 className="font-heading text-lg text-foreground leading-tight">{match.name}</h3>
                  <p className="text-xs text-muted-foreground font-body">{match.brand}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <span className="text-xs font-body font-medium tracking-wider uppercase text-muted-foreground block mb-1">Smells Like</span>
                  <p className="text-xs text-foreground font-body leading-relaxed">{match.smells_like}</p>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
                  <span className="text-xs font-body font-medium tracking-wider uppercase text-primary block mb-1">Why this suits them</span>
                  <p className="text-xs text-foreground font-body leading-relaxed">{match.why_this_suits}</p>
                </div>
              </div>
            </div>

            {/* Dot navigation */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {PREVIEW_MATCHES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCard(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === activeCard ? '20px' : '6px',
                    height: '6px',
                    background: i === activeCard ? '#c4a052' : 'rgba(196,160,82,0.3)',
                  }}
                />
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground font-body mt-2 italic">
              Tap dots to see all three tiers
            </p>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce opacity-60">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
