import React from 'react';
import Navigation from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24">
        <Hero />
        <Features />
      </div>
    </div>
  );
};

export default Index;