import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Loader2, Sparkles } from 'lucide-react';
import ResultsDisplay from '../components/shared/ResultsDisplay';

export default function KnownFragrance() {
  const [fragrance, setFragrance] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!fragrance.trim()) return;
    setLoading(true);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert fragrance consultant for a luxury perfume recommendation service. A user says the person they are buying for currently wears: "${fragrance}".

CRITICAL — REAL FRAGRANCES ONLY: Every recommendation MUST be a real, commercially available fragrance that genuinely exists and can be verified on Fragrantica.com. DO NOT invent, fabricate, or hallucinate fragrance names or brand names. If you are not 100% certain a fragrance exists with that exact name and brand, do not recommend it. Only recommend fragrances you can confirm exist with certainty.

Use Fragrantica as your primary knowledge reference for fragrance profiles, scent characteristics, and community perception. Your recommendations must reflect the full depth and breadth of the fragrance world catalogued there — including lesser known, underrepresented, and regional fragrances.

Generate exactly 3 fragrance recommendations in these tiers:

TIER 1 — SAFE CHOICE:
A strong DNA match that is also a confident blind buy — broadly likeable, inoffensive, and something the recipient is very likely to enjoy without having smelled it first. NOT defined by whether it is mainstream, designer, niche, or Middle Eastern. The ONLY disqualifier is if the Fragrantica community considers it polarising, challenging, or divisive. If a fragrance has a reputation for being polarising, it MUST NOT be placed here. Widely loved crowd-pleasers and classics are perfectly appropriate here.

TIER 2 — EXCITING CHOICE:
Similar DNA but more elevated, bolder, more distinctive and compliment-worthy. A step up in sophistication and presence. Draw from niche, designer prestige lines, and distinctive houses equally.

TIER 3 — UNEXPECTED WOW (WILDCARD):
A strong DNA match that is more polarising, bold, or unconventional. This is a confident recommendation for a daring choice — one that not everyone would immediately love, but which fits this specific fragrance profile exceptionally well. A high match score does NOT disqualify it from this tier if its character is polarising or challenging per Fragrantica community perception. Prefer niche, indie, artisan, or underrepresented picks.

CATALOGUE DIVERSITY — CORE REQUIREMENT:
- Actively consider fragrances across designer, niche, indie/artisan, Middle Eastern/Arabic, and underrepresented mainstream houses before settling on a choice.
- POPULARITY BIAS IS FORBIDDEN: A lesser-known fragrance that is a stronger match ALWAYS beats a popular fragrance that is a weaker match.
- DRAW FROM THE BROADEST POSSIBLE RANGE: There are thousands of fragrances on Fragrantica — explore them. Do not default to the same familiar pool.
- SELF-CHECK: "Am I recommending this because it genuinely fits, or because it's the most familiar option?" If the latter, dig deeper.

For each recommendation provide:
- fragrance_name: the perfume name
- brand: the brand/house
- confidence_score: a number 70-98
- smells_like: a vivid plain-English description of the scent (what it actually smells like to wear, not technical notes)
- why_this_works: explanation of why this recommendation suits someone who wears the original fragrance`,
      response_json_schema: {
        type: "object",
        properties: {
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                fragrance_name: { type: "string" },
                brand: { type: "string" },
                confidence_score: { type: "number" },
                smells_like: { type: "string" },
                why_this_works: { type: "string" }
              }
            }
          }
        }
      },
      add_context_from_internet: true,
      model: 'gemini_3_1_pro'
    });

    setResults(response.recommendations);
    setLoading(false);
  };

  if (results) {
    return (
      <ResultsDisplay
        results={results}
        onReset={() => { setResults(null); setFragrance(''); }}
        title="Your Curated Matches"
        subtitle={`Based on "${fragrance}" — three tiers from safe to spectacular.`}
        quizContext={`The person wears: ${fragrance}`}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Search className="w-6 h-6 text-primary" />
        </div>

        <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-4 block">
          Free Matching
        </span>

        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4 leading-tight">
          What Fragrance Do They Already Wear?
        </h1>

        <p className="text-muted-foreground font-body text-sm mb-10 leading-relaxed max-w-sm mx-auto">
          Tell us their current perfume and we'll find three curated alternatives — from reliably loved to unexpectedly brilliant.
        </p>

        <div className="space-y-4">
          <Input
            value={fragrance}
            onChange={(e) => setFragrance(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. Bleu de Chanel, Miss Dior, Aventus..."
            className="bg-secondary border-border/50 rounded-xl h-12 font-body text-sm text-center"
          />

          <Button
            onClick={handleSearch}
            disabled={!fragrance.trim() || loading}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-12 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding matches...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Recommendations
              </>
            )}
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground font-body">
          Never waste money on the wrong perfume again.
        </p>
      </motion.div>
    </div>
  );
}