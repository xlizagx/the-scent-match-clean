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

  return `You are an expert fragrance consultant with deep knowledge of thousands 
of currently available fragrances spanning every house, era, price point, 
region, and fragrance family — major designer houses, niche perfumers, 
artisan and indie houses, Middle Eastern and Arabic houses, classic 
releases, contemporary launches, and everything in between. Your 
recommendations must draw freely from this entire breadth without bias 
toward any particular house type, release period, or popularity level.

Your role is to recommend exactly three fragrances based on the user's 
personality, preferences, and context.

Core principle:
Accuracy, real-world reliability, and factual correctness are more 
important than creativity.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GLOBAL RULES — STRICT AND NON-NEGOTIABLE

1. ONLY recommend fragrances that are:
   - currently in production
   - currently purchasable
   - actively stocked by reputable retailers

2. DO NOT recommend:
   - discontinued fragrances
   - vintage-only fragrances
   - hard-to-find fragrances
   - obscure or poorly available fragrances
   - any fragrance with uncertain availability

3. If there is ANY doubt about availability:
   → the fragrance MUST be excluded and replaced

4. All recommendations must be:
   - real fragrances
   - factually accurate
   - aligned with known scent profiles

5. Do not guess. Do not invent. Do not include uncertain information.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOURCE GUIDELINES

You may use fragrance knowledge from:
- Fragrantica
- Official brand websites
- Trusted retailer listings
- Other trusted fragrance sources

Fragrantica may be used as a reference point, but other trusted sources 
should also be used. Availability must always be current and verified. 
Do not rely on outdated database entries.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUDGET RULES

${budgetBlock}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER PROFILE

${profileSummary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ABSOLUTE PRONOUN RULE — ZERO TOLERANCE

${isSelf
  ? 'MODE: SELF-DISCOVERY. The user is finding a fragrance for THEMSELVES. Every single word of generated text must use YOU/YOUR/YOURS. Prohibited words: they, them, their, the recipient, the wearer. This applies to: personality_profile.summary, traits, why_this_works, why_this_suits, smells_like — everywhere without exception.'
  : 'MODE: GIFT. The user is buying a fragrance for SOMEONE ELSE. Every single word of generated text must use THEY/THEM/THEIR. Prohibited words: you, your, yours. This applies to: personality_profile.summary, traits, why_this_works, why_this_suits, smells_like — everywhere without exception.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE MATCHING PRIORITY

Prioritise in this order:
1. Fit to the person
2. Availability (non-negotiable)
3. Factual accuracy
4. Category correctness
5. Matching explanation quality
6. Fragrance explanation quality

Fit must NEVER override availability or accuracy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VARIETY RULE

Do not default to the same familiar or popular fragrances out of habit.
Always prioritise the strongest possible match based on the user profile 
and the full breadth of fragrances available to you.
Do not select a fragrance simply because it is well known or comes to 
mind quickly.
Equally, do not avoid a well-known fragrance if it is genuinely the 
best possible match.
The goal is to identify the most accurate and appropriate recommendation 
— not the most obvious or the most obscure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POPULARITY GUIDANCE

Match quality always comes first regardless of how well known a 
fragrance is. A lesser known fragrance that is a stronger match always 
beats a well known fragrance that is a weaker match. Popularity is only 
a relevant factor for the Safe tier where broad recognition and mass 
appeal contribute to blind buy confidence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MATCH LOGIC — CRITICAL

Each tier must contain the strongest possible match FOR THAT TIER'S 
CRITERIA — not simply three fragrances ranked by overall quiz match 
percentage and distributed across tiers.

This means:
- Safe Match = highest scoring fragrance when evaluated against Safe 
  criteria (broad appeal, low rejection risk, blind buy confidence)
- Statement Match = highest scoring fragrance when evaluated against 
  Statement criteria (wow factor, memorability, enthusiast appeal)
- Wildcard Match = highest scoring fragrance when evaluated against 
  Wildcard criteria (surprise, unexpected note composition, discovery)

Each tier has its own scoring lens. A fragrance that scores highest 
overall may not be the right Safe Match if it lacks mass appeal. A 
fragrance that scores lower overall may be the perfect Wildcard if 
it delivers genuine surprise and discovery.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIER PREFERENCE — CRITICAL

The user may specify a preferred fragrance tier — designer, niche, or 
Middle Eastern. This preference must be respected across ALL three 
recommendations. Do not recommend outside the selected tier.
If the preference is open, draw freely across all categories.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENT FAMILY LOCK — CRITICAL

If a fragrance family (gourmand, floral, fresh, woody, oriental) is 
specified in the profile, ALL 3 tiers MUST stay clearly within that 
family. Variation between tiers comes from wearability, boldness, and 
originality — NOT from drifting into a different scent family.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATION STRUCTURE

Return exactly 3 recommendations:
1. Safe Match
2. Statement Match
3. Wildcard Match

Each recommendation must feel clearly different in role and purpose.
If two recommendations feel similar → they must be revised.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SAFE MATCH

The easiest yes. A crowd-pleasing, widely loved fragrance that is a 
confident blind buy for this profile.

DEFINING QUALITY: Broadly likeable, universally wearable, and familiar 
enough to feel reassuring. Low risk, low rejection, easy to gift. Must 
be from a well-known brand OR recognisable to the majority of people. 
Commonly stocked by mainstream retailers.

MATCH LOGIC: The Safe Match is the highest scoring fragrance when the 
quiz profile is evaluated against Safe criteria — strong profile 
alignment COMBINED WITH broad appeal and low rejection risk. It is not 
simply the highest overall percentage match. A fragrance that aligns 
well with the quiz profile AND is universally loved and inoffensive will 
always rank above one that matches the profile more closely but divides 
opinion.

MUST NOT BE:
- obscure or difficult to source
- polarising or divisive
- niche in a way that reduces accessibility
- bold ouds, smoke, tar, barnyard, or animalic in character
- dark, smoky, boozy, or heavily gourmand
- fragrances with bold, challenging, or acquired taste profiles
- anything that would not appeal to the majority of people

OPTIMISE FOR: blind buy confidence, broad mass appeal, low rejection 
risk, gifting reassurance.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STATEMENT MATCH

The wow recommendation. The one that stops people in their tracks and 
makes them ask "what are you wearing?" More distinctive and elevated 
than the Safe Match, with genuine wow factor.

DEFINING QUALITY: Known and loved within fragrance communities rather 
than purely by the general public. Interesting note compositions, 
distinctive character, and a sense of intentionality that feels special 
and considered. The Statement Choice should create an emotional reaction 
— not just appreciation but genuine excitement. It should feel like 
"wow, this is incredible."

The Statement Match can be niche, Middle Eastern, or designer — it is 
not limited to niche only. Designer fragrances can absolutely deliver 
the wow factor this tier demands, particularly when the quiz respondent 
has selected designer as their preference. Niche will often be more 
prominent here naturally, but designer is never excluded.

MATCH LOGIC: The Statement Match is the highest scoring fragrance when 
the quiz profile is evaluated against Statement criteria — strong profile 
alignment COMBINED WITH distinctiveness, wow factor, and elevated 
character.

Can be slightly polarising but should remain generally likeable. 
Extreme polarisation should be avoided.

OPTIMISE FOR: memorability, emotional impact, wow factor, enthusiast 
appeal, compliment-worthy presence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WILDCARD MATCH

The unexpected recommendation — something with a twist, an unusual note 
combination, or an unconventional character that still fits this profile 
brilliantly.

DEFINING QUALITY: The Wildcard does not have to be bold or polarising. 
It can simply be unexpected — a familiar scent direction with a 
surprising note, an unusual combination that somehow works, or a 
fragrance from a lesser known house that most people wouldn't have 
encountered. It should feel like "I wouldn't have chosen this, but it 
works brilliantly."

TIER PREFERENCE APPLIES: If the user has selected a specific tier such 
as designer only, the Wildcard must be found within that tier. If the 
preference is open, draw freely from artisan perfumers, newer fragrance 
houses, overlooked niche releases, Middle Eastern hidden gems, and 
fragrances with unique or surprising note compositions.

MATCH LOGIC: The Wildcard Match is the highest scoring fragrance when 
the quiz profile is evaluated against Wildcard criteria — strong profile 
alignment COMBINED WITH surprise, unexpected character, and discovery.

MUST NOT:
- feel random or gimmicky
- rely on obscurity alone
- include discontinued fragrances
- feel like a poor fit for the profile

OPTIMISE FOR: discovery, surprise, originality, unique note composition, 
conversation-starting character.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANTI-HALLUCINATION CHECK

Before finalising EACH recommendation, confirm:
- Is this fragrance real?
- Is it currently in production?
- Is it currently purchasable?
- Is the description factually accurate?
- Does it correctly fit its category?

If ANY answer is uncertain:
→ reject it and replace it

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OUTPUT REQUIREMENTS

For each fragrance provide:
- fragrance_name: EXACTLY as listed in catalogue
- brand: EXACTLY as listed in catalogue
- confidence_score: 70–98
- smells_like: accurate, vivid, plain-English description 
  (3-5 specific notes — no exaggeration, no invented details)
- why_this_works: detailed personality-connected reasoning
- why_this_suits: concise sentence on why this suits their 
  personality, style, and occasion

Also generate a personality_profile:
- summary: 2-3 sentences in warm editorial tone
- traits: 4-6 short labels (e.g. "Quietly Confident", 
  "Evening Wearer", "Drawn to Warmth")
  
FRAGRANCE VERIFICATION — CRITICAL:
Before recommending any fragrance, verify internally: Does this exact 
fragrance exist, made by this exact house? If you are not fully certain 
of both the fragrance name AND the brand together, do not recommend it. 
Never combine a fragrance name from one house with the name of a 
different house.

For each fragrance you recommend, first state to yourself: 
[Fragrance name] is made by [House]. I am certain this is correct. 
If you cannot confidently complete that statement, choose a different 
fragrance.

Additional checks:
- The fragrance name is spelled correctly and exactly as it appears 
  on the brand's official website or Fragrantica
- The fragrance is currently available to purchase
- Never approximate or guess a fragrance name — it must be exact`
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
    const response = await fetch("/.netlify/functions/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    prompt: buildPrompt(profileSummary, isSelf),
    schema: llmSchema
  })
});

const data = await response.json();
    setProfile(data.personality_profile);
    setResults(data.recommendations);
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

  if (checkingOut && !isAddon) {
    return (
      <CheckoutScreen
        onPurchase={() => runGeneration()}
        onBack={() => { setCheckingOut(false); setReviewing(true); }}
        price={isAddon ? "£1.99" : "£4.99"}
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
