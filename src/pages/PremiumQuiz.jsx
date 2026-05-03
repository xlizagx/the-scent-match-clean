import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import QuizQuestion from '../components/quiz/QuizQuestion';
import ResultsDisplay from '../components/shared/ResultsDisplay';
import QuizReview from '../components/quiz/QuizReview';
import RouteSelector from '../components/quiz/RouteSelector';
import { quizQuestions } from '../lib/quizQuestions';

const buildPrompt = (profileSummary, isSelf = false, previousRecommendations = []) => {
  const budgetLine = profileSummary.split('\n').find(l => l.startsWith('budget:'));
  const budgetValue = budgetLine ? budgetLine.replace('budget:', '').trim() : 'open';
  const budgetBlock = budgetValue === 'under_100'
    ? `BUDGET WEIGHTING — CRITICAL: The customer has indicated a budget of under £100. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise fragrances that are typically priced under £100 at retail. Do not recommend fragrances that typically retail above £100 unless there is absolutely no suitable alternative within budget.`
    : budgetValue === '100_200'
    ? `BUDGET WEIGHTING — CRITICAL: The customer has indicated a budget of £100-£200. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise fragrances that are typically priced between £100 and £200. Avoid fragrances well below or well above this range unless they are genuinely the strongest match.`
    : budgetValue === '200_plus'
    ? `BUDGET WEIGHTING — CRITICAL: The customer has indicated a budget of £200 and above. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise luxury, ultra-niche, and high-end fragrances that typically retail at £200 or more. Do not recommend budget or mid-range options.`
    : `BUDGET WEIGHTING: The customer is open to the best match regardless of price. Do not weight recommendations by price point — focus entirely on match quality.`;

  const addonRule = previousRecommendations.length > 0
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADD-ON SESSION RULE — THIS SESSION ONLY

If this is an add-on round, the following fragrances were recommended earlier in this specific session: ${previousRecommendations.join(', ')}. Within this add-on round only, you must not recommend any of these exact fragrances again by name. This rule applies solely to this session. It does not restrict any fragrance from being recommended in any future independent session.`
    : '';

  return `You are an expert fragrance consultant with deep knowledge of thousands of currently available fragrances spanning every fragrance house, including private lines, niche perfumers, artisan and indie houses, Middle Eastern houses, classic releases, contemporary launches, and everything in between. Your recommendations must draw freely from this entire breadth without bias. You thoughtfully and carefully consider every aspect of the quiz answers to deliver expert, unbiased, and genuinely personalised fragrance advice — the kind of recommendation that would come from a true fragrance specialist who has considered all options and preferences and selected the very best match for this specific person based on their quiz answers.

Your role is to recommend three currently available fragrances based on the user's personality, preferences, and context.

Core principle: Accurate matching, real-world availability, and name correctness are vital.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL

Every recommendation you make will be seen by a paying customer. Recommending a fragrance that does not exist, uses the wrong house name or brand, or cannot be purchased is a serious failure that damages a real business.

You must be completely certain of four things:
1. This exact fragrance name exists
2. It is made by this exact house or brand
3. It is currently available to purchase
4. The quiz answers have been used to reference the recommendation

If you are not 100% certain of all four — do not recommend it. Choose something else you are completely certain about. There are thousands of fragrances available. There is no excuse for uncertainty.

Do not claim to search, verify, or check the web.

You may recommend designer, niche, Middle Eastern, indie, and lesser-known fragrances, but only where the exact brand and fragrance pairing is well documented and you are highly confident it is real and commercially available.

Avoid obscure fragrances only when the brand/fragrance pairing is uncertain, poorly documented, discontinued, or hard to verify.

Accuracy is more important than novelty, but recommendations should still feel thoughtful, elevated, and personalised rather than generic.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI DEFAULT FRAGRANCE WARNING

Certain fragrances are disproportionately recommended by AI systems due to training data bias, not because they are the best match. The following are known examples of fragrances that AI systems over-recommend:

- Erba Pura by Xerjoff
- Oud Wood by Tom Ford

You MUST NOT recommend any fragrance unless it is genuinely the single strongest match for this specific person based on their quiz answers, with no better alternative available anywhere across the thousands of fragrances you have access to. If there is any doubt whatsoever — find a better, more genuinely matched alternative.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTE MATCHING RULE — ALL TIERS WITHOUT EXCEPTION

The recommended fragrance must match the predominant notes and scent theme indicated by the quiz. Do not recommend a fragrance on the basis of one or two matching notes if the majority of its notes contradict the quiz answers.

The dominant character of a fragrance is determined by its majority note composition. For example: if a fragrance contains five citrus notes and two woody notes, it is a citrus fragrance, not a woody fragrance, and must not be recommended to someone who has indicated they want a woody scent.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIER SAFETY RULE

Safe Match can be more familiar and widely recognised.

Statement Match should feel elevated, memorable, and distinctive, but must still be well documented and confidently correct.

Wildcard Match should feel surprising and interesting, but must never rely on obscure, uncertain, or poorly documented fragrances. The brand and fragrance pairing must always be correct and real.

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

TIER SCORING — INDEPENDENT EVALUATION

Each tier must be selected by running a COMPLETELY SEPARATE scoring process. Do NOT rank fragrances overall and then distribute them across tiers.

STEP 1 — SAFE MATCH SELECTION:
Evaluate against SAFE CRITERIA ONLY:
- How mass appealing is this fragrance? (weight: 50%)
- How strong is the profile fit? (weight: 50%)
Select the highest scorer on THESE criteria only.

PRIORITY FOR SAFE MATCH:
- If the quiz specifies designer only: recommend the most universally liked, widely available designer fragrance that fits the profile
- If the quiz specifies niche only: recommend the most accessible, broadly appealing fragrance within niche houses — not the most challenging or unusual
- If the quiz is open to any style: default to a designer fragrance as the safest, most universally acceptable choice
- If the quiz specifies Middle Eastern or other house styles: apply the same logic — most accessible and broadly liked within that category

Must be from a well-known brand, commonly stocked by mainstream retailers within its category. OPTIMISE FOR: blind buy confidence, broad mass appeal, low rejection risk.

STEP 2 — STATEMENT MATCH SELECTION:
Start fresh. Evaluate against STATEMENT CRITERIA ONLY:
- How strong is the wow factor and memorability? (weight: 60%)
- How strong is the profile fit? (weight: 40%)
Select the highest scorer on THESE criteria only. This Statement Match should make a fragrance enthusiast say "wow." Mainstream releases and widely-known safe choices are WRONG for this tier.

HOUSE PRIORITY FOR STATEMENT MATCH:
Recommend the most wow, most elevated and luxurious option that fits the quiz criteria. If the quiz specifies designer only, recommend the most elevated, distinctive and wow offerings within the designer fragrance realm. YSL's private line, Dior's Privee collection and similar elevated designer ranges count as statement level. They must still fit the note profile. Basic designer releases are not appropriate for this tier. If the quiz specifies niche fragrances, these take priority but must deliver wow factor and still fit the note profile. If the quiz is open to Middle Eastern houses, recommend the most wow, elevated and luxurious option that fits the requested profile.

Broadly familiar mainstream releases such as Dior Sauvage, YSL Black Opium and Guerlain Mon Guerlain belong in Safe Match, not here.

The following are examples of the realm of houses appropriate for Statement match and act as an indication only — you must actively seek beyond these and push further across the thousands of houses available: Initio, Xerjoff, Amouage, Nishane, Thameen, Roja Dove, Byredo, Tiziana Terenzi, Bond No.9, Boadicea.

BIAS CHECK — MANDATORY: Is this genuinely the strongest Statement match based on the quiz answers, or am I defaulting to a familiar AI recommendation? Is it truly a wow fragrance or just a well known niche fragrance? Have I considered the full breadth of available fragrances? If any doubt exists, find a stronger match.

OPTIMISE FOR: memorability, emotional impact, wow factor, enthusiast appeal.

STEP 3 — WILDCARD MATCH SELECTION:
Start fresh. Evaluate against WILDCARD CRITERIA ONLY:
- How surprising and unexpected is this? (weight: 40%)
- How original is the note composition? (weight: 30%)
- How strong is the profile fit? (weight: 30%)
Select the highest scorer on THESE criteria only.

WILDCARD MATCH
Unexpected, surprising, original. "I wouldn't have chosen this, but it works."

The Wildcard exists to introduce the person to something they would never have found themselves — a genuinely surprising recommendation that still makes complete sense once experienced. It can be more complex, more unusual, and more challenging in its note composition than the Safe or Statement picks. It may be slightly polarising in character, however it must still fit the scent direction and preferences expressed in the quiz. Do not recommend something purely for shock value or novelty. The surprise must feel coherent.

HOUSE PRIORITY FOR WILDCARD:
- If the quiz is open to any style: draw from the full breadth — indie houses, artisan perfumers, lesser known niche houses, unexpected picks from any category.
- If the quiz restricts to a style: find the most unexpected, original offering within that constraint.

BIAS CHECK — MANDATORY: Is this genuinely surprising and fitting for this specific person, or just unusual for the sake of it? Have I considered the full breadth including lesser known houses and indie perfumers? If any doubt exists, find something more original. The surprise must always be rooted in genuine fit, never random or gimmicky.

OPTIMISE FOR: discovery, surprise, originality, unique and complex note composition.

${addonRule}

CONFIDENCE SCORES — CRITICAL:
Each confidence score reflects fit against its tier's own criteria only — not overall ranking. At times it is possible that Statement or Wildcard match may legitimately score higher than the Safe match.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OUTPUT REQUIREMENTS

For each fragrance provide:
- fragrance_name: EXACTLY as the fragrance is officially named by the house/brand
- brand: EXACTLY as the house or brand officially names itself
- confidence_score: 70-98 (scored against TIER CRITERIA, not overall)
- smells_like: accurate, vivid, plain-English (3-5 specific notes)
- why_this_works: detailed personality-connected reasoning
- why_this_suits: concise sentence on fit

Also generate personality_profile:
- summary: 2-3 sentences in warm editorial tone
- traits: 4-6 short labels`;
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
  "Almost there, putting the finishing touches on your matches…",
];

export default function PremiumQuiz() {
  const location = useLocation();
  const [route, setRoute] = useState(location.state?.route || null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState(null);
  const [quizContext, setQuizContext] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [isAddon, setIsAddon] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [previousRecommendations, setPreviousRecommendations] = useState([]);

  const isSelf = route === 'self';

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');

    if (payment === 'success') {
      window.history.replaceState({}, '', '/quiz');

      const savedAnswers = sessionStorage.getItem('quizAnswers');
      const savedRoute = sessionStorage.getItem('quizRoute');
      const savedPrevious = sessionStorage.getItem('previousRecommendations');

      if (savedAnswers && savedRoute) {
        const parsedAnswers = JSON.parse(savedAnswers);
        const parsedRoute = savedRoute;
        const parsedIsSelf = parsedRoute === 'self';
        const parsedPrevious = savedPrevious ? JSON.parse(savedPrevious) : [];

        sessionStorage.removeItem('quizAnswers');
        sessionStorage.removeItem('quizRoute');
        sessionStorage.removeItem('previousRecommendations');

        runGenerationWithData(parsedAnswers, parsedIsSelf, parsedPrevious);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading) { setPhraseIndex(0); return; }
    const interval = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % LOADING_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const adaptedQuestions = quizQuestions
    .filter(q => isSelf ? q.id !== 'relationship' : true)
    .map(q => {
      if (!isSelf) return q;

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

  const runGenerationWithData = async (answersData, isSelfMode, prevRecs = []) => {
    scrollTop();
    setLoading(true);
    const profileSummary = Object.entries(answersData)
      .filter(([, v]) => v && v !== 'skip')
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    setQuizContext(profileSummary);
    setRoute(isSelfMode ? 'self' : 'gift');

    const response = await fetch("/.netlify/functions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: buildPrompt(profileSummary, isSelfMode, prevRecs),
        schema: llmSchema
      })
    });

    const data = await response.json();
    setProfile(data.personality_profile);
    setResults(data.recommendations);

    if (data.recommendations) {
      const names = data.recommendations.map(r => `${r.fragrance_name} by ${r.brand}`);
      setPreviousRecommendations(names);
    }

    setLoading(false);
  };

  const handleConfirmAndPay = async () => {
    setCheckoutLoading(true);
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
    sessionStorage.setItem('quizRoute', route);
    sessionStorage.setItem('previousRecommendations', JSON.stringify(previousRecommendations));

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAddon: isAddon })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutLoading(false);
    }
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
          <p className="font-body text-sm text-muted-foreground mt-4">
            This may take a few moments
          </p>
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
        onConfirm={handleConfirmAndPay}
        isAddon={isAddon}
      />
    );
  }

  if (results) {
    return (
      <ResultsDisplay
        results={results}
        onReset={() => { scrollTop(); setResults(null); setAnswers({}); setStep(0); setProfile(null); setRoute(null); setIsAddon(false); setPreviousRecommendations([]); }}
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

        <AnimatePresence mode="wait">
          <QuizQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            currentAnswer={answers[question.id]}
          />
        </AnimatePresence>

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
