import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ResultsThankYou() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-14 border-t border-border/40 pt-12 text-center"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Heart className="w-5 h-5 text-primary" />
      </div>

      <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-4 leading-snug">
        Thank you for using The Scent Match
      </h3>

      <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-md mx-auto mb-3">
        We hope we've helped make fragrance gifting feel easier, more thoughtful, and far less stressful.
      </p>
      <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-md mx-auto mb-8">
        Whether it's the perfect gift for them or your own next favourite, we hope this discovery has saved you time, brought real excitement, and given you complete confidence in your choice.
      </p>

      <div className="bg-card border border-border/40 rounded-2xl p-6 max-w-md mx-auto">
        <p className="text-sm text-foreground font-body leading-relaxed mb-5">
          Loved your match? Share The Scent Match with a friend, leave a review, and help them discover the perfect scent too.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-wide rounded-full px-5 h-9"
          >
            <a href="/support#review">Leave a Review</a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="font-body text-xs rounded-full px-5 h-9 border-border/50"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'The Scent Match',
                  text: 'Find the perfect fragrance match in under 3 minutes — for gifts or yourself.',
                  url: window.location.origin,
                });
              } else {
                navigator.clipboard.writeText(window.location.origin);
              }
            }}
          >
            Share with a friend
          </Button>
        </div>
      </div>
    </motion.div>
  );
}