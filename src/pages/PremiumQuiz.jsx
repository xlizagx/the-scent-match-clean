import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import QuizQuestion from '../components/quiz/QuizQuestion';
import ResultsDisplay from '../components/shared/ResultsDisplay';
import QuizReview from '../components/quiz/QuizReview';
import CheckoutScreen from '../components/quiz/CheckoutScreen';
import RouteSelector from '../components/quiz/RouteSelector';
import { quizQuestions } from '../lib/quizQuestions';

const buildPrompt = (profileSummary, isSelf = false) => {
  // Parse budget for weighting instructions
  const budgetLine = profileSummary.split('\n').find(l => l.startsWith('budget:'));
  const budgetValue = budgetLine ? budgetLine.replace('budget:', '').trim() : 'open';
  const budgetBlock = budgetValue === 'under_100'
    ? `BUDGET WEIGHTING — CRITICAL: The customer has indicated a budget of under £100. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise fragrances that are typically priced under £100 at retail. Do not recommend fragrances that typically retail above £100 unless there is absolutely no suitable alternative within budget.`
    : budgetValue === '100_200'
    ? `BUDGET WEIGHTING — CRITICAL: The customer has indicated a budget of £100–£200. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise fragrances that typically retail between £100 and £200. Avoid fragrances well below or well above this range unless they are genuinely the strongest match.`
    : budgetValue === '200_plus'
    ? `BUDGET WEIGHTING — CRITICAL: The customer has indicated a budget of £200 and above. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise luxury, ultra-niche, and high-end fragrances that typically retail at £200 or more. Do not recommend budget or mid-range options.`
    : `BUDGET WEIGHTING: The customer is open to the best match regardless of price. Do not weight recommendations by price point — focus entirely on match quality.`;

  const pronoun = isSelf ? 'the customer themselves' : 'the recipient';

  return `You are an elite fragrance consultant for The Scent Match, a premium perfume recommendation service.

CRITICAL — REAL FRAGRANCES ONLY: Every recommendation MUST be a real, commercially available fragrance that genuinely exists and can be verified on Fragrantica.com. DO NOT invent, fabricate, or hallucinate fragrance names or brand names. If you are not 100% certain a fragrance exists with that exact name and brand, do not recommend it. Only recommend fragrances you can confirm exist with certainty.

YOUR KNOWLEDGE BASE: You have comprehensive knowledge of the entire Fragrantica database — thousands of fragrances spanning every house, era, price point, region, and fragrance family. This includes major designer houses, independent niche perfumers, artisan and indie houses, Middle Eastern and Arabic houses, discontinued classics, overlooked releases, newer launches, and cult favourites that never achieved mainstream recognition. Your recommendations must draw from this full breadth. You are NOT limited to any pre-approved list.

MANDATORY VARIETY RULE: Before finalising any recommendation, mentally scan across the full spectrum of houses and releases. If your first instinct is one of the 20-30 most commonly recommended fragrances globally (e.g. Baccarat Rouge 540, Tobacco Vanille, Aventus, Sauvage, Black Opium, La Vie Est Belle, Bleu de Chanel, etc.), you MUST ask yourself: is there a lesser-known fragrance that is an equally strong or stronger match? If yes, recommend that instead. Default recommendations are only acceptable when they are genuinely the highest-scoring match with no comparable alternatives.

${budgetBlock}

CUSTOMER PROFILE:
${profileSummary}

ABSOLUTE PRONOUN RULE — ZERO TOLERANCE:
${isSelf
  ? 'MODE: SELF-DISCOVERY. The user is finding a fragrance for THEMSELVES. Every single word of generated text must use YOU/YOUR/YOURS. Prohibited words: they, them, their, the recipient, the wearer. This applies to: personality_profile.summary, traits, why_this_works, why_this_suits, smells_like — everywhere without exception.'
  : 'MODE: GIFT. The user is buying a fragrance for SOMEONE ELSE. Every single word of generated text must use THEY/THEM/THEIR. Prohibited words: you, your, yours. This applies to: personality_profile.summary, traits, why_this_works, why_this_suits, smells_like — everywhere without exception.'}

FRAGRANCE CATALOGUE DIVERSITY — CORE REQUIREMENT:
Use Fragrantica as your primary knowledge reference. Your recommendations must reflect the full depth and breadth of the fragrance world catalogued there — including lesser known, underrepresented, and regional fragrances that may be a strong match. Approach every recommendation as a knowledgeable independent perfumer with genuine range who always finds the most fitting choice, not the most familiar one.

1. POPULARITY BIAS IS FORBIDDEN: Do not weight recommendations toward bestsellers or widely-known fragrances. A niche or lesser-known fragrance that is a stronger match ALWAYS beats a popular fragrance that is a weaker match.

2. MATCH QUALITY FIRST: Your only criteria is how well the fragrance suits this specific user's profile. Popularity, name recognition, and commercial success are irrelevant.

3. DRAW FROM THE BROADEST POSSIBLE RANGE: Every time you generate recommendations, actively consider fragrances across designer, niche, indie/artisan, Middle Eastern/Arabic, and underrepresented mainstream houses before settling on a choice. There are thousands of fragrances catalogued on Fragrantica — explore them. Do not default to the same pool of familiar names.

4. RESPECT USER TIER CHOICE, THEN GO DEEP WITHIN IT: The user's chosen tier (designer, niche, Middle Eastern) is absolute. Within that tier, draw from the full breadth available — not just the most recognisable names.

5. SELF-CHECK before finalising: "Am I recommending this because it genuinely fits, or because it's the most familiar option?" If the latter, dig deeper. There is never an excuse to default to the obvious choice.

6. Repeating a fragrance for different users is fine IF it is genuinely the best match for that specific profile. Every recommendation must be earned by fit, not habit.

7. CHALLENGE YOUR FIRST INSTINCT FOR STATEMENT AND WILDCARD: If your first instinct is a widely recognised fragrance for these tiers, ask what a knowledgeable independent perfumer would recommend instead. Go there first.

   For safe recommendations, widely loved crowd-pleasers and classics are appropriate — they are exactly what the Safe tier is for.

SCENT FAMILY LOCK — CRITICAL:
If a fragrance family (gourmand, floral, fresh, woody, oriental) is specified in the profile, ALL 3 tiers MUST stay clearly within that family. Variation between tiers comes from wearability, boldness, and originality — NOT from drifting into a different scent family.

Generate exactly 3 recommendations in this LOCKED tier framework:

TIER 1 — SAFE MATCH:
The easiest yes. A strong match across ALL quiz inputs that is also a confident blind buy — something the recipient is very likely to enjoy without having smelled it first.
DEFINING QUALITY: Broadly likeable, inoffensive, universally wearable. NOT defined by whether it is mainstream, designer, niche, or Middle Eastern — a niche fragrance or a Middle Eastern fragrance can absolutely be a safe blind buy. The ONLY disqualifier is if a fragrance is considered polarising, challenging, or divisive in character by the Fragrantica community. If a fragrance has a reputation for being polarising or difficult, it MUST NOT be placed here regardless of match score.
OPTIMISE FOR: blind buy confidence, broad mass appeal, low rejection risk, gifting reassurance.
CATALOGUE BREADTH: Draw from the full verified catalogue. Do not default to the same familiar names. Include overlooked gems, niche safe bets, and Middle Eastern crowd-pleasers — as long as they are widely liked and not divisive.
CRITICAL: Do NOT place bold ouds, smoke, tar, barnyard, animalic, or strongly polarising profiles here under any circumstances.

TIER 2 — STATEMENT CHOICE:
The memorable, emotionally striking, gift-worthy recommendation. More bold and distinctive than the Safe Match.
Draw broadly from: niche prestige houses, premium designer statements, distinctive Middle Eastern profiles, private lines (Chanel Les Exclusifs, Dior La Collection Privée, Tom Ford Private Blend, Guerlain Les Exclusifs), couture houses (Paco Rabanne, Valentino, Thierry Mugler), niche houses (Initio, Roja Dove, Parfums de Marly, Xerjoff, Amouage, Creed, Nishane, Orto Parisi, MFK, Diptyque, Serge Lutens, L'Artisan Parfumeur).
Vary houses across runs. Keep this tier broad, diverse, luxury-led, and emotionally memorable.

TIER 3 — WILDCARD DISCOVERY:
A strong match across ALL quiz inputs that is MORE POLARISING, BOLD, or UNCONVENTIONAL than the Safe Match. This is a confident recommendation for a daring choice — one that not everyone would immediately love, but which fits this specific profile exceptionally well. A high match score does NOT disqualify a fragrance from the Wildcard if its character is polarising or challenging.
OPTIMISE FOR: discovery, surprise, originality, and bold character — while maintaining strict match accuracy against the user's profile.
Draw from: overlooked niche houses, Middle Eastern hidden gems (Lattafa, Afnan, Armaf, Swiss Arabian, Abdul Samad Al Qurashi, Zimaya, Fragrance World), unusual note twists, daring compositions, artisan houses (Orto Parisi, Zoologist, DS & Durga, 19-69, Commodity, Régime des Fleurs), emerging perfumers.
Use Fragrantica community data and perception to guide polarising/challenging classification for both Safe Match and Wildcard placement.

For each recommendation provide:
- fragrance_name: EXACTLY as in catalogue
- brand: EXACTLY as in catalogue
- confidence_score: 70–98
- smells_like: vivid plain-English note description (mention 3-5 specific notes)
- why_this_works: detailed personality-connected reasoning (use correct pronouns)
- why_this_suits: concise sentence on why this suits their personality, style, and occasion (use correct pronouns)

Also generate a personality_profile:
- summary: 2–3 sentences in warm editorial tone (use correct pronouns for ${pronoun})
- traits: 4–6 short labels (e.g. "Quietly Confident", "Evening Wearer", "Drawn to Warmth")`;
};

const llmSchema = {
  type: "object",
  properties: {
    personality_profile: {
      type: "object",
      properties: {
        summary: { type: "string" },
        traits: { type: "array", items: { type: "string" } }
      }
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          fragrance_name: { type: "string" },
            brand: { type: "string" },
            confidence_score: { type: "number" },
            smells_like: { type: "string" },
            why_this_works: { type: "string" },
            why_this_suits: { type: "string" }
        }
      }
    }
  }
};

const LOADING_PHRASES = [
  "Consulting our fragrance expertise…",
  "Refining your recommendations…",
  "Finding the perfect match…",
];

export default function PremiumQuiz() {
  const location = useLocation();
  const [route, setRoute] = useState(location.state?.route || null); // null | 'gift' | 'self'
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState(null);
  const [quizContext, setQuizContext] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [isAddon, setIsAddon] = useState(false);

  const isSelf = route === 'self';

  // Ensure Q1 always starts at top on initial mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  useEffect(() => {
    if (!loading) { setPhraseIndex(0); return; }
    const interval = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % LOADING_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  // Adapt question wording for self route
  const adaptedQuestions = quizQuestions
    .filter(q => isSelf ? q.id !== 'relationship' : true)
    .map(q => {
      if (!isSelf) return q;

      // Custom overrides for self route
      if (q.id === 'scent_direction') {
        return {
          ...q,
          title: 'What scent style would suit you best?',
          subtitle: "Choose the fragrance energy you naturally gravitate towards.",
          options: q.options.map(o => ({
            ...o,
            description: o.description?.replace(/their/gi, 'your').replace(/\bthem\b/gi, 'you'),
          })),
        };
      }

      if (q.id === 'occasion') {
        return {
          ...q,
          title: 'When will you wear this fragrance?',
          subtitle: 'The occasion shapes the ideal projection, mood, and character of the scent.',
          options: [
            { value: 'everyday', label: 'Everyday Signature', description: 'Your daily go-to — versatile and reliable' },
            { value: 'evening', label: 'Evening & Going Out', description: 'Seductive, deeper, more intimate' },
            { value: 'special', label: 'Special Occasions', description: 'Events, celebrations, memorable moments' },
            { value: 'work', label: 'Professional Setting', description: 'Office-appropriate, sophisticated, not overpowering' },
            { value: 'open_exploring', label: "I'm open to exploring", description: 'No fixed occasion — just discovering what feels right' },
          ],
        };
      }

      if (q.id === 'known_fragrance') {
        return {
          ...q,
          title: 'Do you already have a favourite perfume?',
          subtitle: "Don't worry if you're unsure, but if you do, it helps us refine the match even further.",
          placeholder: 'e.g. Chanel No.5, Aventus, Black Opium... or leave blank',
        };
      }

      return {
        ...q,
        title: q.title
          .replace(/their/gi, 'your')
          .replace(/\bthem\b/gi, 'you')
          .replace(/\bthey\b/gi, 'you'),
        subtitle: q.subtitle
          ? q.subtitle.replace(/their/gi, 'your').replace(/\bthem\b/gi, 'you').replace(/\bthey\b/gi, 'you')
          : q.subtitle,
        options: q.options?.map(o => ({
          ...o,
          description: o.description?.replace(/their/gi, 'your').replace(/\bthem\b/gi, 'you'),
        })),
      };
    });

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' });

  const runGeneration = async () => {
    setCheckingOut(false);
    scrollTop();
    setLoading(true);
    const profileSummary = Object.entries(answers)
      .filter(([, v]) => v && v !== 'skip')
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    setQuizContext(profileSummary);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: buildPrompt(profileSummary, isSelf),
      response_json_schema: llmSchema,
      add_context_from_internet: true,
      model: 'gemini_3_1_pro'
    });
    setProfile(response.personality_profile);
    setResults(response.recommendations);
    setLoading(false);
  };

  const startAddonQuiz = (addonRoute) => {
    setIsAddon(true);
    setResults(null);
    setProfile(null);
    setAnswers({});
    setStep(0);
    setRoute(addonRoute);
    scrollTop();
  };

  if (!route) {
    return <RouteSelector onSelect={(r) => { scrollTop(); setRoute(r); }} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-8" />
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="font-heading text-xl text-foreground"
            >
              {LOADING_PHRASES[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (reviewing) {
    return (
      <QuizReview
        answers={answers}
        questions={adaptedQuestions}
        onAnswerUpdate={(questionId, value) => {
          setAnswers(prev => ({ ...prev, [questionId]: value }));
        }}
        onBack={() => { scrollTop(); setStep(adaptedQuestions.length - 1); setReviewing(false); }}
        onConfirm={() => {
          scrollTop();
          setReviewing(false);
          setCheckingOut(true);
        }}
      />
    );
  }

  if (checkingOut) {
    return (
      <CheckoutScreen
        onPurchase={() => runGeneration()}
        onBack={() => { setCheckingOut(false); setReviewing(true); }}
        price={isAddon ? "£1.99" : "£5.00"}
        label={isAddon ? "Unlock your next round of matched fragrance recommendations" : "Unlock your 3 individually matched fragrance recommendations"}
      />
    );
  }

  if (results) {
    return (
      <ResultsDisplay
        results={results}
        onReset={() => { scrollTop(); setResults(null); setAnswers({}); setStep(0); setProfile(null); setRoute(null); setIsAddon(false); }}
        onAddonGift={() => startAddonQuiz('gift')}
        onAddonSelf={() => startAddonQuiz('self')}
        title={isSelf ? "Your Perfect Matches" : "Their Perfect Matches"}
        subtitle={isSelf ? "Expertly curated around your personality and preferences." : "Expertly curated based on their unique personality and preferences."}
        isSelf={isSelf}
        profile={profile}
        onProfileUpdate={setProfile}
        quizContext={quizContext}
      />
    );
  }

  const question = adaptedQuestions[step];
  const progress = ((step + 1) / adaptedQuestions.length) * 100;
  const canProceed =
    question.type === 'text' ||
    (question.type === 'multiselect'
      ? Array.isArray(answers[question.id]) && answers[question.id].length > 0
      : !!answers[question.id]);
  const isLast = step === adaptedQuestions.length - 1;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = () => {
    scrollTop();
    if (!isLast) {
      setStep(step + 1);
    } else {
      setReviewing(true);
    }
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-body text-muted-foreground">
              Question {step + 1} of {adaptedQuestions.length}
            </span>
            <span className="text-xs font-body text-primary font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <QuizQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            currentAnswer={answers[question.id]}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <Button
            variant="ghost"
            onClick={() => { scrollTop(); step === 0 ? setRoute(null) : setStep(step - 1); }}
            className="font-body text-sm text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed && question.type !== 'text'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-6 h-11"
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Review Answers
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}