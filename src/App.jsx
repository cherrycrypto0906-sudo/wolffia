import React from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { PainSection } from './components/sections/PainSection';
import { SolutionSection } from './components/sections/SolutionSection';
import { NutritionInfo } from './components/sections/NutritionInfo';
import { FoodGallery } from './components/sections/FoodGallery';
import { Benefits } from './components/sections/Benefits';
import { Pricing } from './components/sections/Pricing';
import { SocialProof } from './components/sections/SocialProof';
import { Testimonials } from './components/sections/Testimonials';
import { Bonus } from './components/sections/Bonus';
import { LeadForm } from './components/sections/LeadForm';
import { ZaloCommunity } from './components/sections/ZaloCommunity';
import { FAQ } from './components/sections/FAQ';
import { FinalCTA } from './components/sections/FinalCTA';
import { FloatingActions } from './components/layout/FloatingActions';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PainSection />
        <SolutionSection />
        <NutritionInfo />
        <FoodGallery />
        <Benefits />
        <Pricing />
        <SocialProof />
        <Testimonials />
        <Bonus />
        <LeadForm />
        <ZaloCommunity />
        <FAQ />
      </main>
      <FinalCTA />
      <FloatingActions />
    </>
  );
}

export default App;
