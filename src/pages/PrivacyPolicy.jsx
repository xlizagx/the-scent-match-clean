import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground font-body hover:text-foreground transition-colors mb-10">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <h1 className="font-heading text-4xl text-foreground mb-2">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground font-body mb-10">Last updated: April 2026</p>

      <div className="space-y-8 font-body text-sm text-foreground/80 leading-relaxed">

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Who We Are</h2>
          <p>The Scent Match is a fragrance recommendation service operated as a sole trader based in the United Kingdom. You can reach us via our <Link to="/contact" className="text-primary underline underline-offset-2">contact page</Link> or by emailing info@thescentmatch.com.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">What Information We Collect</h2>
          <p className="mb-3">When you use The Scent Match, we may collect the following information:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Quiz answers</strong> — your responses to our fragrance questionnaire, including preferences, occasion, budget, and personality traits</li>
            <li><strong>Email address</strong> — if you choose to have your recommendations sent to your inbox</li>
            <li><strong>Payment information</strong> — processed securely by Stripe. We never see or store your full card details</li>
            <li><strong>Usage data</strong> — basic information about how you interact with our site, collected via cookies</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">How We Use Your Information</h2>
          <p className="mb-3">We use the information you provide to:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Generate your personalised fragrance recommendations</li>
            <li>Send your recommendations to your email address if requested</li>
            <li>Process your payment securely via Stripe</li>
            <li>Improve our service over time</li>
          </ul>
          <p className="mt-3">We do not sell your data to third parties. We do not use your information for advertising purposes.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Email Marketing</h2>
          <p>If you opt in to receive occasional updates from The Scent Match, we will use your email address to send you relevant fragrance ideas and news. You can unsubscribe at any time by clicking the unsubscribe link in any email, or by getting in touch via our <Link to="/contact" className="text-primary underline underline-offset-2">contact page</Link>.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Third Parties</h2>
          <p className="mb-3">We use the following trusted third-party services:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Stripe</strong> — for secure payment processing. Stripe's privacy policy is available at stripe.com/privacy</li>
            <li><strong>Resend</strong> — to deliver email recommendations to your inbox</li>
            <li><strong>Netlify</strong> — to host our website</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Your Rights</h2>
          <p className="mb-3">Under UK GDPR, you have the right to:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to how we use your data</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, please get in touch via our <Link to="/contact" className="text-primary underline underline-offset-2">contact page</Link> or email info@thescentmatch.com.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Data Retention</h2>
          <p>We retain your data only for as long as necessary to provide our service. Quiz answers are not stored beyond the session unless you have opted in to receive emails.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Cookies</h2>
          <p>Please see our <Link to="/cookies" className="text-primary underline underline-offset-2">Cookie Policy</Link> for full details.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Changes to This Policy</h2>
          <p>We may update this policy from time to time. Any changes will be posted on this page with an updated date.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Contact</h2>
          <p>Please get in touch via our <Link to="/contact" className="text-primary underline underline-offset-2">contact page</Link> or email info@thescentmatch.com.</p>
        </section>

      </div>
    </div>
  );
}
