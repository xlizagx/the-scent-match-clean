import React from 'react';
import { Link } from 'react-router-dom';

export default function FooterCTA() {
  return (
    <footer className="border-t border-border/50 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        <img
          src="https://media.base44.com/images/public/69cac3f60d3002bf060b0af7/77b7a26b6_0F24452C-74B5-41E9-A3C8-22250A3F06E7.png"
          alt="The Scent Match"
          className="h-14 w-auto object-contain opacity-80"
        />
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/privacy-policy" className="text-xs text-muted-foreground font-body hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-xs text-muted-foreground font-body hover:text-foreground transition-colors">Terms & Conditions</Link>
          <Link to="/cookies" className="text-xs text-muted-foreground font-body hover:text-foreground transition-colors">Cookie Policy</Link>
          <Link to="/refunds" className="text-xs text-muted-foreground font-body hover:text-foreground transition-colors">Refund Policy</Link>
        </nav>
        <p className="text-xs text-muted-foreground font-body">© {new Date().getFullYear()} The Scent Match. All rights reserved.</p>
      </div>
    </footer>
  );
}
