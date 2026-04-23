import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground font-body hover:text-foreground transition-colors mb-10">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <h1 className="font-heading text-4xl text-foreground mb-2">Terms & Conditions</h1>
      <p className="text-xs text-muted-foreground font-body mb-10">Last updated: April 2026</p>

      <div className="space-y-8 font-body text-sm text-foreground/80 leading-relaxed">

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">About Us</h2>
          <p>The Scent Match is a fragrance recommendation service operated as a sole trader in the United Kingdom. By using our website and services, you agree to these terms.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Our Service</h2>
          <p>The Scent Match provides expertly curated, personalised fragrance recommendations based on answers provided through our questionnaire. We charge a one-time fee of £4.99 for three recommendations, and an optional add-on of £1.99 for an additional round of recommendations.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">What You Are Paying For</h2>
          <p className="mb-3">When you pay for The Scent Match service, you are paying for:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Access to our recommendation system</li>
            <li>Three personalised fragrance recommendations expertly curated to your quiz answers</li>
            <li>An optional additional round of recommendations for £1.99</li>
          </ul>
          <p className="mt-3">You are not purchasing any physical product. Results are delivered digitally and instantly upon payment.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Accuracy of Recommendations</h2>
          <p>Our recommendations are expertly curated based on your quiz answers and are intended as specialist guidance. While we take every care to ensure recommendations are accurate, currently available, and well-matched to your preferences, fragrance is deeply personal and subjective. We cannot guarantee that every recommendation will be the perfect choice for every individual, but we are committed to providing the most thoughtful and considered match possible.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Refund Policy</h2>
          <p>Please see our <Link to="/refunds" className="text-primary underline underline-offset-2">Refund Policy</Link> for full details.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Intellectual Property</h2>
          <p>All content on The Scent Match website, including text, design, and recommendation outputs, is the property of The Scent Match. You may not reproduce or redistribute our content without permission.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Limitation of Liability</h2>
          <p>The Scent Match is not liable for any indirect or consequential losses arising from the use of our service. Our total liability to you shall not exceed the amount you paid for the service.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Governing Law</h2>
          <p>These terms are governed by the laws of England and Wales.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Changes to These Terms</h2>
          <p>We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Contact</h2>
          <p>Please get in touch via our <Link to="/contact" className="text-primary underline underline-offset-2">contact page</Link> or email info@thescentmatch.com.</p>
        </section>

      </div>
    </div>
  );
}
