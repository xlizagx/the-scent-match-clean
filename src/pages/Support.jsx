import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ChevronDown, ChevronUp, Sparkles, MessageSquare, HelpCircle, Star, X } from 'lucide-react';

const FAQS = [
  {
    q: "How quickly will I receive my fragrance recommendations?",
    a: "The moment payment is confirmed, your answers are carefully interpreted and turned into three individually matched recommendations instantly. There's no waiting and no delay."
  },
  {
    q: "How accurate are the recommendations?",
    a: "Each recommendation is carefully personalised around the recipient's personality, style, gifting context, and scent preferences to create the closest possible emotional and fragrance fit. Every result includes a confidence score to show how strongly the fragrance aligns with the answers provided, helping you quickly understand which options feel safest, bolder, or more discovery-led. We also include a clear explanation of why we believe they'll love each fragrance, so every recommendation feels personal, justified, and easy to trust."
  },
  {
    q: "Can I choose more than one fragrance world?",
    a: "Yes - you can select up to two fragrance worlds. For example, you might choose 'Luxury niche & discovery' and 'Middle Eastern' to receive a blend of elevated niche and oud-rich oriental recommendations. Selecting 'Open to the best fit' lets us curate the best overall fit for them based on their full profile."
  },
  {
    q: "What's the difference between Designer, Luxury niche & discovery, and Middle Eastern options?",
    a: "Designer houses (such as Dior, Chanel, YSL, and Jo Malone) are widely recognised names offering consistent, approachable quality. Luxury niche & discovery houses (such as Maison Francis Kurkdjian, Parfums de Marly, and Nishane) are typically independent, artisan-led European or American brands focused on elevated, distinctive compositions. Middle Eastern luxury houses (such as Afnan, Lattafa, and Armaf) specialise in rich, oud-forward and oriental styles rooted in the tradition of Arabic perfumery - often offering extraordinary quality at surprisingly accessible prices. You can choose up to two worlds to blend across categories."
  },
  {
    q: "Why use a personalised scent match instead of choosing a bestseller?",
    a: "Bestsellers are popular for a reason, but they're designed to appeal to the widest possible audience - not to a specific person. A personalised match considers their personality, style, the occasion, and how they carry a scent, so the result feels genuinely tailored. You're far more likely to surprise and delight someone with something they wouldn't have found themselves than with a fragrance they've already seen in every shop window."
  },
  {
    q: "Can I change my answers before the recommendations are generated?",
    a: "Absolutely. After completing all questions you will reach a Review step that displays your key selections. You can edit any answer before confirming - your payment only triggers the final generation step, so you are always in control."
  },
  {
    q: "What if the fragrance recommendations don't feel quite right?",
    a: "Fragrance is deeply personal, which is exactly why every match is built around personality, style, occasion, and scent preferences rather than generic bestseller lists. While no fragrance service can guarantee personal taste with absolute certainty, The Scent Match is designed to dramatically improve the likelihood of choosing something they'll genuinely connect with. Each recommendation includes a Safe Match, Statement Choice, and Wildcard Discovery to give you a thoughtful range of highly relevant options."
  },
];

function SizeGuideButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
    >
      {children}
    </button>
  );
}

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full text-left p-5 flex items-center justify-between gap-4 font-body text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{faq.q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-primary shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            {faq.a}
          </p>
        </div>
      )}
    </div>
  );
}

function SizeGuideModal({ type, onClose }) {
  const isHoodie = type === 'hoodie';
  const title = isHoodie ? 'Hoodie Size Guide' : 'T-Shirt Size Guide';
  const image = isHoodie ? '/size-guide-hoodie.png' : '/size-guide-tshirt.png';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close size guide"
          className="absolute -top-2 -right-2 md:top-2 md:right-2 z-10 w-10 h-10 rounded-full bg-background/95 border border-border/60 flex items-center justify-center text-foreground hover:bg-secondary transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={image}
          alt={title}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}

export default function Support() {
  const location = useLocation();
  const isConsultation = location.state?.issueType === 'Personal Scent Session - Early Access';

  const [form, setForm] = useState({
    name: '',
    email: '',
    issue_type: isConsultation ? 'personal-scent-session' : 'general-enquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sizeGuide, setSizeGuide] = useState(null);

  useEffect(() => {
    if (isConsultation) {
      setForm(f => ({ ...f, issue_type: 'personal-scent-session' }));
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isConsultation]);

  useEffect(() => {
    if (!location.hash) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...form })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setSubmitting(false);
  };

  const clothingFAQs = [
    {
      q: "How do I choose my size?",
      a: "Please check the measurements carefully before ordering. We recommend measuring a similar item of clothing that fits you well and comparing it with our size guide."
    },
    {
      q: "What size guide should I use?",
      a: (
        <>
          For hoodies, please use our{' '}
          <SizeGuideButton onClick={() => setSizeGuide('hoodie')}>
            Hoodie Size Guide
          </SizeGuideButton>
          . For T-shirts, please use our{' '}
          <SizeGuideButton onClick={() => setSizeGuide('tshirt')}>
            T-Shirt Size Guide
          </SizeGuideButton>
          .
        </>
      )
    },
    {
      q: "What measurements are included?",
      a: "Our guides show the garment's length, width and half chest measurements in inches, so you can compare them with a garment you already own."
    },
    {
      q: "What if I am between sizes?",
      a: "If you are between sizes, we recommend choosing the larger size for a more relaxed fit."
    },
    {
      q: "Are the measurements the same for all clothing?",
      a: "No. Hoodies and T-shirts have different measurements, so please use the correct guide for the item you are ordering."
    },
    {
      q: "Can I return or exchange an item if I order the wrong size?",
      a: "Our clothing is made to order, so we cannot accept returns or exchanges because the wrong size was selected. Please check the relevant Size Guide carefully before placing your order."
    },
    {
      q: "What if my item arrives damaged or defective?",
      a: "If your item arrives damaged or defective, please contact us as soon as possible with photographs. We will look into the issue and arrange an appropriate resolution."
    },
    {
      q: "Can I cancel my order?",
      a: "Because clothing is made to order, orders can move into production quickly. We cannot cancel items once production has started."
    },
    {
      q: "How should I care for my clothing?",
      a: "Please follow the washing and care instructions on the garment label to help keep your clothing and print looking its best."
    },
  ];

  const issueTypes = [
    { value: 'general-enquiry', label: 'General enquiry' },
    { value: 'personal-scent-session', label: 'Personal Scent Session - Early Access' },
    { value: 'duplicate-result', label: 'Duplicate result received' },
    { value: 'technical-issue', label: 'Technical issue' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          id="support-guidance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 scroll-mt-24"
        >
          <Sparkles className="w-7 h-7 text-primary mx-auto mb-5" />
          <h1 className="font-heading text-4xl text-foreground mb-4">Support & Guidance</h1>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-md mx-auto">
            Everything you need to gift with complete confidence.
          </p>
        </motion.div>

        {/* Clothing FAQs */}
        <motion.section
          id="clothing-faqs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 scroll-mt-28"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-2xl text-foreground">Clothing FAQs</h2>
          </div>

          <div className="space-y-3">
            {clothingFAQs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </motion.section>

        {/* Fragrance Quiz FAQs */}
        <motion.section
          id="fragrance-quiz-faqs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 scroll-mt-28"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-2xl text-foreground">Fragrance Quiz FAQs</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 scroll-mt-28"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-2xl text-foreground">
              {isConsultation ? 'Register Your Interest' : 'Get in Touch'}
            </h2>
          </div>

          {isConsultation && (
            <p className="text-sm text-muted-foreground font-body text-center mb-6 leading-relaxed">
              Leave your details below and we'll be in touch to confirm your space and introductory rate.
            </p>
          )}

          {submitted ? (
            <div className="text-center py-14 bg-card border border-border/40 rounded-2xl">
              <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
              <p className="font-heading text-xl text-foreground mb-2">
                {isConsultation ? 'Interest registered' : 'Message received'}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                {isConsultation ? "We'll be in touch shortly to confirm your space." : "We'll be in touch shortly."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border/40 rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <Input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="bg-secondary border-border/50 rounded-xl h-11 font-body text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="bg-secondary border-border/50 rounded-xl h-11 font-body text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Enquiry Type</label>
                <select
                  value={form.issue_type}
                  onChange={e => setForm({ ...form, issue_type: e.target.value })}
                  className="w-full bg-secondary border border-border/50 rounded-xl h-11 font-body text-sm text-foreground px-3 focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {issueTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={isConsultation ? "Tell us a little about yourself and what you're looking for..." : "Tell us what happened or what you need help with..."}
                  required
                  rows={5}
                  className="w-full bg-secondary border border-border/50 rounded-xl font-body text-sm text-foreground px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 font-body">{error}</p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-12 w-full"
              >
                {submitting ? 'Sending...' : isConsultation ? 'Register My Interest' : 'Send Message'}
              </Button>
            </form>
          )}
        </motion.section>

        {/* Leave a Review */}
        <ReviewSection />

      </div>

      {sizeGuide && (
        <SizeGuideModal
          type={sizeGuide}
          onClose={() => setSizeGuide(null)}
        />
      )}
    </div>
  );
}

function ReviewSection() {
  const [form, setForm] = useState({ name: '', email: '', location: '', quote: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'review', ...form })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setSubmitting(false);
  };

  return (
    <motion.section
      id="review"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-center gap-2 mb-8">
        <Star className="w-4 h-4 text-primary" />
        <h2 className="font-heading text-2xl text-foreground">Leave a Review</h2>
      </div>

      <p className="text-sm text-muted-foreground font-body mb-8 leading-relaxed">
        Did The Scent Match help you find a fragrance gift they truly loved? We'd be delighted to hear your story.
      </p>

      {submitted ? (
        <div className="text-center py-14 bg-card border border-border/40 rounded-2xl">
          <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
          <p className="font-heading text-xl text-foreground mb-2">Thank you for sharing</p>
          <p className="text-sm text-muted-foreground font-body">Your gifting story means a lot to us.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-card border border-border/40 rounded-2xl p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Your Name</label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Sophie R."
                required
                className="bg-secondary border-border/50 rounded-xl h-11 font-body text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="bg-secondary border-border/50 rounded-xl h-11 font-body text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Location</label>
              <Input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. London, UK"
                className="bg-secondary border-border/50 rounded-xl h-11 font-body text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Your Gifting Story</label>
            <textarea
              value={form.quote}
              onChange={e => setForm({ ...form, quote: e.target.value })}
              placeholder="Tell us how the gift was received, or what made the match so right..."
              required
              rows={4}
              className="w-full bg-secondary border border-border/50 rounded-xl font-body text-sm text-foreground px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-body">{error}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-12 w-full"
          >
            {submitting ? 'Submitting...' : 'Share Your Story'}
          </Button>
        </form>
      )}
    </motion.section>
  );
}
