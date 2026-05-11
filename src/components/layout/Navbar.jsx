import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
    }
  };

  const handleAnchorNav = (e, path, hash) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname === path) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'instant' });
    } else {
      navigate(path);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'instant' });
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between">
        <a href="/" onClick={handleLogoClick} className="flex items-center">
          <img
            src="https://media.base44.com/images/public/69cac3f60d3002bf060b0af7/77b7a26b6_0F24452C-74B5-41E9-A3C8-22250A3F06E7.png"
            alt="The Scent Match"
            className="h-16 md:h-20 w-auto object-contain -ml-4 scale-[1.35] origin-left mix-blend-screen brightness-110"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/#how-it-works" onClick={e => handleAnchorNav(e, '/', 'how-it-works')} className="text-xs font-body text-foreground/80 hover:text-primary transition-colors tracking-wide">How it works</a>
          <a href="/#reviews" onClick={e => handleAnchorNav(e, '/', 'reviews')} className="text-xs font-body tex
