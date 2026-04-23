import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground font-body hover:text-foreground transition-colors mb-10">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <h1 className="font-heading text-4xl text-foreground mb-2">Refund Policy</h1>
      <p className="text-xs text-muted-foreground font-body mb-10">Last updated: April 2026</p>

      <div className="space-y-8 font-body text-sm text-foreground/80 leading-relaxed">

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Our Service</h2>
          <p>The Scent Match provides a digital, expertly curated fragrance recommendation service. Results are delivered instantly and digitally upon payment.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">UK Consumer Rights</h2>
          <p>Under the Consumer Contracts Regulations 2013, you have the right to cancel a digital service within 14 days of purchase. However, by proceeding with payment and receiving your recommendations, you expressly consent to the immediate delivery of the digital content and acknowledge that your right to cancel is lost once the recommendations have been delivered.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Our Goodwill Policy</h2>
          <p>While we are not legally obligated to offer refunds once recommendations have been delivered, we want every customer to feel confident using The Scent Match. If you are genuinely dissatisfied with your recommendations, please get in touch via our <Link to="/contact" className="text-primary underline underline-offset-2">contact page</Link> within 7 days of purchase and we will review your case on an individual basis.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Technical Issues</h2>
          <p>If you experience a technical issue that prevents you from receiving your recommendations after payment, please contact us immediately via our <Link to="/contact" className="text-primary underline underline-offset-2">contact page</Link> and we will resolve the issue or issue a full refund.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-foreground mb-3">Add-On Purchases</h2>
          <p>The same policy applies to the optional £1.99 add-on recommendation round.</p>
        </section>

      </div>
    </div>
  );
}
