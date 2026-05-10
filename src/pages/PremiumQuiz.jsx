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
    ? `BUDGET WEIGHTING - CRITICAL: The customer has indicated a budget of under £100. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise fragrances that are typically priced under £100 at retail. Do not recommend fragrances that typically retail above £100 unless there is absolutely no suitable alternative within budget.`
    : budgetValue === '100_200'
    ? `BUDGET WEIGHTING - CRITICAL: The customer has indicated a budget of £100-£200. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise fragrances that are typically priced between £100 and £200. Avoid fragrances well below or well above this range unless they are genuinely the strongest match.`
    : budgetValue === '200_plus'
    ? `BUDGET WEIGHTING - CRITICAL: The customer has indicated a budget of £200 and above. Across ALL tiers (Safe, Statement, Wildcard) and any add-on rounds, you MUST prioritise luxury, ultra-niche, and high-end fragrances that typically retail at £200 or more. Do not recommend budget or mid-range options.`
    : `BUDGET WEIGHTING: The customer is open to the best match regardless of price. Do not weight recommendations by price point - focus entirely on match quality.`;

  const addonRule = previousRecommendations.length > 0
    ? `
ADD-ON SESSION RULE - THIS SESSION ONLY

The following fragrances were recommended earlier in this session: ${previousRecommendations.join(', ')}. Do not recommend any of these again in this add-on round. This rule applies to this session only.`
    : '';

  return `You are an expert fragrance consultant with deep knowledge of thousands of real, currently available fragrances - private lines, niche, artisan, indie, Middle Eastern, classic and contemporary. Recommend freely across this full breadth without bias, delivering genuinely personalised advice based entirely on the quiz answers.

VERIFICATION - CRITICAL

Every recommendation is seen by a paying customer. Before including any fragrance confirm all four:
1. The fragrance name is real and exists
2. The brand is real and exists
3. The name and brand are paired correctly
4. It is currently available to purchase

If any doubt exists - choose something else. There are thousands of fragrances. There is no excuse for uncertainty.

AI BIAS WARNING

Some fragrances are over-recommended by AI due to training bias. Only recommend a fragrance if it is genuinely the strongest match for this person. If any doubt exists - find a better alternative.

NOTE MATCHING

Recommendations must match the predominant notes and scent theme from the quiz answers. Do not recommend a fragrance on the basis of one or two matching notes - it must be the majority of notes fitting the criteria. A fragrance with mostly citrus notes is a citrus fragrance - not woody - regardless of minor note overlap.

TIER RULES

Safe Match: familiar, widely recognised and likeable - the fragrance name and brand must be real and correctly matched to each other.
Statement Match: elevated and distinctive with a wow factor - the fragrance name and brand must be real and correctly matched to each other.
Wildcard Match: surprising and interesting - the fragrance name and brand must be real and correctly matched to each other.

BUDGET

${budgetBlock}

CUSTOMER PROFILE

${profileSummary}

PRONOUNS

${isSelf
  ? 'MODE: SELF-DISCOVERY. Use YOU/YOUR/YOURS throughout. Never use they, them, their.'
  : 'MODE: GIFT. Use THEY/THEM/THEIR throughout. Never use you, your, yours.'}

TIER SELECTION

Select three fragrances independently. Do not rank overall and distribute - run a completely separate selection process for each tier, as if the others do not exist.

SAFE MATCH: Score equally on mass appeal and profile fit. Recommend the most universally liked option within whatever style the quiz specifies - designer, niche, Middle Eastern or open. Must be widely available and broadly appealing. Optimise for blind buy confidence and low rejection risk.

STATEMENT MATCH: Match on both wow factor and profile fit. Would make a fragrance expert say wow. Mainstream releases like Dior Sauvage, YSL Black Opium and Guerlain Mon Guerlain belong in Safe - not here. Recommend the most elevated option within whatever style the quiz specifies. Elevated designer ranges like Dior Prive and YSL Le Vestiaire count here. Reference houses for direction only - do not default to them: Initio, Xerjoff, Amouage, Nishane, Roja, Byredo, Parfums de Marly. Always explore the full breadth. Optimise for memorability, emotional impact and wow factor.

WILDCARD MATCH: Something the person would never have found themselves that still makes complete sense yet original. Surprising but relevant. Can be more complex and unusual than the other tiers but must still fit the quiz answers. Can draw from lesser known niche and indie houses if the quiz answers allow, otherwise find the most unexpected option within that constraint. Optimise for discovery, surprise and originality.

${addonRule}

CONFIDENCE SCORES - CRITICAL:
Each confidence score reflects fit against its tier's own criteria only - not overall ranking. At times it is possible that Statement or Wildcard match may legitimately score higher than the Safe match.

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
            { value: 'everyday', label: 'Everyday Signature', description: 'Your daily go-to - versatile and reliable' },
            { value: 'evening', label: 'Evening & Going Out', description: 'Seductive, deeper, more intimate' },
            { value: 'special', label: 'Special Occasions', description: 'Events, celebrations, memorable moments' },
            { value: 'work', label: 'Professional Setting', description: 'Office-appropriate, sophisticated, not overpowering' },
            { value: 'open_exploring', label: "I'm open to exploring", description: 'No fixed occasion - just discovering what feels right' },
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
