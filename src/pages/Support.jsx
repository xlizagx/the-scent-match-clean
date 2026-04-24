import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ChevronDown, ChevronUp, Sparkles, MessageSquare, HelpCircle, Star } from 'lucide-react';

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
    a: "Yes — you can select up to two fragrance worlds. For example, you might choose 'Luxury niche & discovery' and 'Middle Eastern' to receive a blend of elevated niche and oud-rich oriental recommendations. Selecting 'Open to the best fit' lets us curate the best overall fit for them based on their full profile."
  },
  {
    q: "What's the difference between Designer, Luxury niche & discovery, and Middle Eastern options?",
    a: "Designer houses (such as Dior, Chanel, YSL, and Jo Malone) are widely recognised names offering consistent, approachable quality. Luxury niche & discovery houses (such as Maison Francis Kurkdjian, Parfums de Marly, and Nishane) are typically independent, artisan-led European or American brands focused on elevated, distinctive compositions. Middle Eastern luxury houses (such as Afnan, Lattafa, and Armaf) specialise in rich, oud-forward and oriental styles rooted in the tradition of Arabic perfumery — often offering extraordinary quality at surprisingly accessible prices. You can choose up to two worlds to blend across categories."
  },
  {
    q: "Why use a personalised scent match instead of choosing a bestseller?",
    a: "Bestsellers are popular for a reason, but they're designed to appeal to the widest possible audience — not to a specific person. A personalised match considers their personality, style, the occasion, and how they carry a scent, so the result feels genuinely tailored. You're far more likely to surprise and delight someone with something they wouldn't have found themselves than with a fragrance they've already seen in every shop window."
  },
  {
    q: "Can I change my answers before the recommendations are generated?",
    a: "Absolutely. After completing all questions you will reach a Review step that displays your key selections. You can edit any answer before confirming — your payment only triggers the final generation step, so you are always in control."
  },
  {
    q: "What if the fragrance recommendations don't feel quite right?",
    a: "Fragrance is deeply personal, which is exactly why every match is built around personality, style, occasion, and scent preferences rather than generic bestseller lists. While no fragrance service can guarantee personal taste with absolute certainty, The Scent Match is designed to dramatically improve the likelihood of choosing something they'll genuinely connect with. Each recommendation includes a Safe Match, Statement Choice, and Wildcard Discovery to give you a thoughtful range of highly relevant options."
  },
];

const ISSUE_TYPES = [
  { value: 'general-enquiry', label: 'General enquiry' },
  { value: 'duplicate-result', label: 'Duplicate result received' },
  { value: 'technical-issue', label: 'Technical issue' },
  { value: 'other', label: 'Other' },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        className="w-full text-left p-5 flex items-center justify-between gap-4 font-body text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{faq.q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-muted-foreground font-body leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const [form, setForm] = useState({ name: '', email: '', issue_type: 'general-enquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/contact') {
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('form-name', 'contact');
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('issue_type', form.issue_type);
      formData.append('message', form.message);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Form submission error:', err);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div id="support-guidance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 scroll-mt-24">
          <Sparkles className="w-7 h-7 text-primary mx-auto mb-5" />
          <h1 className="font-heading text-4xl text-foreground mb-4">Support & Guidance</h1>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-md mx-auto">
            Everything you need to gift with complete confidence.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.section id="faq" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 scroll-mt-28">
          <div className="flex items-center justify-center gap-2 mb-8">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-2xl text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.section id="contact" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 scroll-mt-28">
          <div className="flex items-center justify-center gap-2 mb-8">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-2xl text-foreground">Get in Touch</h2>
          </div>

          {submitted ? (
            <div className="text-center py-14 bg-card border border-border/40 rounded-2xl">
              <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
              <p className="font-heading text-xl text-foreground mb-2">Message received</p>
              <p className="text-sm text-muted-foreground font-body">We'll be in touch shortly.</p>
            </div>
          ) : (
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
              className="bg-card border border-border/40 rounded-2xl p-8 space-y-5"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <Input
                    name="name"
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
                    name="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="bg-secondary border-border/50 rounded-xl h-11 font-body text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Issue Type</label>
                <select
                  name="issue_type"
                  value={form.issue_type}
                  onChange={e => setForm({ ...form, issue_type: e.target.value })}
                  className="w-full bg-secondary border border-border/50 rounded-xl h-11 font-body text-sm text-foreground px-3 focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {ISSUE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what happened or what you need help with..."
                  required
                  rows={5}
                  className="w-full bg-secondary border border-border/50 rounded-xl font-body text-sm text-foreground px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-12 w-full"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </motion.section>

        {/* Leave a Review */}
        <ReviewSection />

      </div>
    </div>
  );
}

function ReviewSection() {
  const [form, setForm] = useState({ name: '', location: '', quote: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('form-name', 'review');
      formData.append('name', form.name);
      formData.append('location', form.location);
      formData.append('quote', form.quote);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Review submission error:', err);
    }
    setSubmitting(false);
  };

  return (
    <motion.section id="review" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
        <form
          name="review"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="bg-card border border-border/40 rounded-2xl p-8 space-y-5"
        >
          <input type="hidden" name="form-name" value="review" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Your Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Sophie R."
                required
                className="bg-secondary border-border/50 rounded-xl h-11 font-body text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Location</label>
              <Input
                name="location"
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
              name="quote"
              value={form.quote}
              onChange={e => setForm({ ...form, quote: e.target.value })}
              placeholder="Tell us how the gift was received, or what made the match so right..."
              required
              rows={4}
              className="w-full bg-secondary border border-border/50 rounded-xl font-body text-sm text-foreground px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
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
