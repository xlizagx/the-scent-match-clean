import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative min-h-[75vh] grid grid-cols-1 md:grid-cols-2">
      {/* Text side - shows first on mobile */}
      <div className="order-1 md:order-2 flex items-center justify-center px-6 pt-12 pb-6 md:pt-16 md:pb-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-md text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary">
              Fragrance-Inspired Apparel
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-foreground mb-6">
            Wearable Scent-Inspired<br />
            <span className="text-primary">Gifts, Ready To Ship.</span>
          </h1>

          <p className="font-body text-base md:text-lg text-foreground/75 leading-relaxed mb-8 font-light tracking-wide">
            Hoodies, tees, totes and more - designed for the fragrance obsessed.
          </p>

          <Button
            asChild
            size="lg"
            className="w-full sm:w-72 mx-auto md:mx-0 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-8 h-12 flex items-center gap-2"
          >
            <Link to="/shop">
              <ShoppingBag className="w-4 h-4" />
              Shop The Collection
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Image side - shows second on mobile */}
      <div className="order-2 md:order-1 relative min-h-[50vh] md:min-h-full">
        <img
          src={heroImage}
          alt="Model wearing a black hoodie with Vanilla Is My Love Language design"
          className="w-full h-full object-cover object-[center_15%]"
        />
      </div>
    </section>
  );
}
