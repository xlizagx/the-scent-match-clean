import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FooterCTA from '../components/home/FooterCTA';

const HERO_IMAGE = '/hero-hoodie.png';

export default function Home() {
  return (
    <div>
      <HeroSection heroImage={HERO_IMAGE} />
      <FooterCTA />
    </div>
  );
}
