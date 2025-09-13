'use client';

import { useEffect } from 'react';
import CtaSection from '@/components/home/CtaSection';
import HeroSection from '@/components/home/HeroSection';
import LocationsSection from '@/components/home/LocationsSection';
import MinistriesSection from '@/components/home/MinistriesSection';
import PastorsSection from '@/components/home/PastorsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import VisiSection from '@/components/home/VisiSection';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Every Nation Indonesia - Gereja yang Berpusat pada Kristus';
  }, []);

  return (
    <div className="bg-white text-gray-800 overflow-x-hidden">
      <HeroSection />
      <VisiSection />
      <LocationsSection />
      <MinistriesSection />
      <PastorsSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
