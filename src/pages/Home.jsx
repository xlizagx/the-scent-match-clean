import React from 'react';
import HeroSection from '../components/home/HeroSection';
import TrustSection from '../components/home/TrustSection';
import MemorySection from '../components/home/MemorySection';
import PathsSection from '../components/home/PathsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FooterCTA from '../components/home/FooterCTA';

const HERO_IMAGE = 'https://media.base44.com/images/public/69cac3f60d3002bf060b0af7/6f6a5c1f7_generated_image.png';
const MEMORY_IMAGE = 'https://media.base44.com/images/public/69cac3f60d3002bf060b0af7/e7784ae5d_generated_5faabd6f.png';
const GIFT_IMAGE = 'https://media.base44.com/images/public/69cac3f60d3002bf060b0af7/09d8eb581_generated_1e6e2cb0.png';

export default function Home() {
  return (
    <div>
      <HeroSection heroImage={HERO_IMAGE} />
      <TrustSection />
      <MemorySection memoryImage={MEMORY_IMAGE} />
      <PathsSection />
      <TestimonialsSection />
      <FooterCTA />
    </div>
  );
}