import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground font-body hover:text-foreground transition-colors mb-10">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <h1 className="font-heading text-4xl text-foreground mb-2">Cookie Policy</h1>
      <p className="text-xs text-muted-foreground font-body mb-10">Last updated: April 2026</p>

      <div className="space-y-8 font-body text-sm text-foreground/80 leading-relaxed">

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help websites function properly and provide information about how visitors use the site.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Cookies We Use</h2>

          <h3 className="font-body font-semibold text-foreground mb-2 mt-4">Essential Cookies</h3>
          <p className="mb-3">These cookies are necessary for the website to function and cannot be switched off. They include:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Session cookies</strong> — used to remember your quiz answers and progress during your session</li>
            <li><strong>Payment cookies</strong> — used by Stripe to process your payment securely</li>
          </ul>

          <h3 className="font-body font-semibold text-foreground mb-2 mt-6">Analytics Cookies</h3>
          <p>We may use basic analytics to understand how visitors use our site. This helps us improve the service. No personally identifiable information is collected through analytics.</p>

          <h3 className="font-body font-semibold text-foreground mb-2 mt-6">Third-Party Cookies</h3>
          <p>Our payment provider Stripe may set cookies on your device as part of the payment process. These are governed by Stripe's own cookie policy available at stripe.com/cookies-policy.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Managing Cookies</h2>
          <p>You can control and delete cookies through your browser settings. Please note that disabling cookies may affect the functionality of our site, including your ability to complete the quiz and payment process.</p>
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
