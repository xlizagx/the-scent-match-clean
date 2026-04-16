import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import FragranceCard from './FragranceCard';
import PersonalityProfile from './PersonalityProfile';
import AddOnUpsell from './AddOnUpsell';
import EmailCapture from './EmailCapture';
import CheckoutScreen from '../quiz/CheckoutScreen';
import ResultsThankYou from './ResultsThankYou';

export default function ResultsDisplay({ results, onReset, onAddonGift, onAddonSelf, title, subtitle, profile, onProfileUpdate, quizContext, isSelf }) {
  const [profileData, setProfileData] = useState(profile || null);
  const [addOnUnlocked, setAddOnUnlocked] = useState(false);

  const tiers = ['safe', 'statement', 'wildcard'];

  const handleProfileUpdate = (updated) => {
    setProfileData(updated);
    if (onProfileUpdate) onProfileUpdate(updated);
  };

  const handleUnlockGift = () => {
    setAddOnUnlocked(true);
    if (onAddonGift) onAddonGift();
  };

  const handleUnlockSelf = () => {
    setAddOnUnlocked(true);
    if (onAddonSelf) onAddonSelf();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
          {title || "Your Perfect Matches"}
        </h2>
        <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
          {subtitle || "Three curated recommendations tailored to their taste — from safe to spectacular."}
        </p>
      </motion.div>

      {/* Personality Profile */}
      {profileData && (
        <PersonalityProfile profile={profileData} onUpdate={handleProfileUpdate} />
      )}

      {/* Primary Results */}
      <div className="space-y-6 mb-6">
        {results.map((rec, i) => (
          <FragranceCard key={i} recommendation={rec} tier={tiers[i]} index={i} isSelf={isSelf} />
        ))}
      </div>

      {/* Email Capture — shown after results */}
      <EmailCapture results={results} profile={profileData} quizContext={quizContext} />

      {/* Add-On Upsell — shown only before unlock */}
      {!addOnUnlocked && (
        <AddOnUpsell
          onUnlockGift={handleUnlockGift}
          onUnlockSelf={handleUnlockSelf}
        />
      )}

      {/* Thank You + Share block */}
      <ResultsThankYou />

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-full font-body text-sm border-border/50 h-11"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Another
        </Button>
        <Button asChild className="rounded-full font-body text-sm bg-primary text-primary-foreground h-11">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}