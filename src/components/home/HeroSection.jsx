import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Sparkles, Feather, Star, Lightbulb, Clock, BookOpen, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const badges = [
  { icon: BookOpen, label: 'Just a Few Quick Questions' },
  { icon: Star, label: '3 Expert Picks' },
  { icon: Lightbulb, label: 'Insights Into Why They Work' },
  { icon: Clock, label: 'Only £4.99 • Instant Results' },
];

const OFFER_END = new Date('2026-05-17T23:59:00');

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, target - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: timeLeft === 0 };
}

export default function HeroSection({ heroImage }) {
  const navigate = useNavigate();
  const { days, hours, minutes, seconds, expired } = useCountdown(OFFER_END.getTime());

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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Gem className="w-4 h-4 text-primary" />
            <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary">
              Fragrance Expertise
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-foreground mb-6">
            The Smarter Way<br />
            to Buy<br />
            <span className="text-primary">Fragrance</span>
          </h1>

          {/* UPDATED SUBTITLE */}
          <p className="font-body text-base md:text-lg text-foreground/75 leading-relaxed mb-8 max-w-lg font-light tracking-wide">
            Take the guesswork out of gifting.<br />Expert fragrance recommendations perfectly matched to the person you're buying for - or find your own next favourite.
          </p>

          {/* Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-center"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(var(--primary-rgb, 212,175,55), 0.35)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-body text-foreground/90 leading-snug">{label}</span>
              </div>
            ))}
          </div>

          {/* UPDATED ROUTE PILLS */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-primary px-2">
                Most Popular
              </span>
              <Button
                onClick={() => handleRoute('gift')}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Find The Perfect Gift
              </Button>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-transparent px-2">
                &nbsp;
              </span>
              <Button
                onClick={() => handleRoute('self')}
                size="lg"
                variant="outline"
                className="bg-transparent border-primary text-primary hover:bg-primary/10 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
              >
                <Feather className="w-4 h-4" />
                Discover Your Next Favourite
              </Button>
            </div>
          </div>

          {/* ADDED TAGLINE */}
          <p className="font-body text-sm text-foreground/50 italic tracking-wide mb-6">
            Life's too short not to smell incredible.
          </p>

          {/* Offer block */}
          {!expired && (
            <div
              className="mt-2 rounded-xl px-4 py-4"
              style={{
                background: 'linear-gradient(145deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                border: '1px solid rgba(212,175,55,0.5)',
                boxShadow: '0 4px 20px rgba(212,175,55,0.15)',
              }}
            >
              {/* Row 1 - Offer title */}
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-primary" />
                <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-primary">
                  50% off your first match - this week only
                </span>
              </div>
              {/* Row 2 - Countdown timer */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-body text-foreground/50">Offer ends in</span>
                <div className="flex items-center gap-2">
                  {[
                    { value: days, label: 'd' },
                    { value: hours, label: 'h' },
                    { value: minutes, label: 'm' },
                    { value: seconds, label: 's' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex items-center gap-0.5">
                      <span
                        className="font-heading text-lg text-primary tabular-nums"
                        style={{ minWidth: '1.5rem', textAlign: 'center' }}
                      >
                        {String(value).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-foreground/50 font-body">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Row 3 - Discount code */}
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-foreground/75">Use code</span>
                <span
                  className="font-body text-sm font-bold tracking-widest text-primary px-2 py-0.5 rounded"
                  style={{ background: 'rgba(212,175,55,0.15)' }}
                >
                  FIRSTMATCH50
                </span>
                <span className="font-body text-sm text-foreground/75">at checkout</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce opacity-60">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
