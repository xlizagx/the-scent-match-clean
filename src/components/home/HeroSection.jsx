import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Sparkles, Feather, Star, Lightbulb, Clock, BookOpen, Tag, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const badges = [
  { icon: BookOpen, label: 'Just a Few Quick Questions' },
  { icon: Star, label: '3 Expert Picks' },
  { icon: Lightbulb, label: 'Insights Into Why They Work' },
  { icon: Clock, label: 'Only £4.99 • Instant Results' },
];

export default function HeroSection({ heroImage, shopImage }) {
  const navigate = useNavigate();

  const handleRoute = (route) => {
    navigate('/quiz', { state: { route } });
  };

  const handleShop = () => {
    navigate('/shop');
  };

  return (
    <section className="relative min-h-[75vh] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[75vh]">

        {/* LEFT: QUIZ SIDE */}
        <div className="relative flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Luxury perfume bottle in warm golden light"
              className="w-full h-full object-cover object-right opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          </div>
          <div className="relative z-10 max-w-xl mx-auto px-6 py-10 md:py-14 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Gem className="w-4 h-4 text-primary" />
                <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary">
                  Fragrance Expertise
                </span>
              </div>

              <h1 className="font-heading text-3xl md:text-5xl leading-tight tracking-tight text-foreground mb-6">
                Never Get a Fragrance<br />
                <span className="text-primary">Gift Wrong Again.</span>
              </h1>

              <p className="font-body text-base text-foreground/75 leading-relaxed mb-8 max-w-lg font-light tracking-wide">
                The smartest £4.99 you'll ever spend.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
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

              <div className="flex flex-col gap-3 mb-3">
                <div className="flex flex-col items-start gap-1 w-full">
                  <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-primary px-2">
                    Most Popular
                  </span>
                  <Button
                    onClick={() => handleRoute('gift')}
                    size="lg"
                    className="w-full sm:w-72 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Find The Perfect Scent Match
                  </Button>
                </div>
                <div className="flex flex-col items-start gap-1 w-full">
                  <Button
                    onClick={() => handleRoute('self')}
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-72 bg-transparent border-primary text-primary hover:bg-primary/10 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-body text-sm text-foreground/75">First time here? Try it for half price. Use code</span>
                  <span
                    className="font-body text-sm font-bold tracking-widest text-primary px-2 py-0.5 rounded"
                    style={{ background: 'rgba(212,175,55,0.15)' }}
                  >
                    FIRSTMATCH50
                  </span>
                  <span className="font-body text-sm text-foreground/75">at checkout.</span>
                </div>
                <p className="font-body text-xs text-foreground/50 italic mt-2">
                  Quiz only - not valid on shop items.
                </p>
              </div>

            </motion.div>
          </div>
        </div>

        {/* RIGHT: SHOP SIDE */}
        <div className="relative flex items-center overflow-hidden border-t lg:border-t-0 lg:border-l border-primary/20">
          <div className="absolute inset-0">
            <img
              src={shopImage}
              alt="Wearable fragrance-inspired gifts - hoodies and tote bag"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          </div>
          <div className="relative z-10 max-w-xl mx-auto px-6 py-10 md:py-14 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary">
                  The Shop
                </span>
              </div>

              <h2 className="font-heading text-3xl md:text-5xl leading-tight tracking-tight text-foreground mb-6">
                Wearable Scent-Inspired<br />
                <span className="text-primary">Gifts, Ready To Ship.</span>
              </h2>

              <p className="font-body text-base text-foreground/75 leading-relaxed mb-8 max-w-lg font-light tracking-wide">
                Hoodies, tees, totes and more - designed for the fragrance obsessed.
              </p>

              <Button
                onClick={handleShop}
                size="lg"
                className="w-full sm:w-72 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop The Collection
              </Button>

              <p className="font-body text-sm text-foreground/50 italic tracking-wide mt-6">
                Free UK shipping on orders over £40.
              </p>
            </motion.div>
          </div>
        </div>

      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce opacity-60">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
