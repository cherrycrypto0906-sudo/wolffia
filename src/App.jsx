import React from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { PainSection } from './components/sections/PainSection';
import { SolutionSection } from './components/sections/SolutionSection';
import { NutritionInfo } from './components/sections/NutritionInfo';
import { FoodGallery } from './components/sections/FoodGallery';
import { Benefits } from './components/sections/Benefits';
import { Pricing } from './components/sections/Pricing';
import { PaymentSection } from './components/sections/PaymentSection';
import { PaymentPage } from './components/sections/PaymentPage';
import { SocialProof } from './components/sections/SocialProof';
import { Testimonials } from './components/sections/Testimonials';
import { Bonus } from './components/sections/Bonus';
import { LeadForm } from './components/sections/LeadForm';
import { FAQ } from './components/sections/FAQ';
import { FinalCTA } from './components/sections/FinalCTA';
import { FloatingActions } from './components/layout/FloatingActions';
import { Chatbot } from './components/UI/Chatbot';
import { AdminPanel } from './components/admin/AdminPanel';

function App() {
  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  if (window.location.pathname === '/thanhtoan') {
    return <PaymentPage />;
  }

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
        <Bonus />
        <LeadForm />
        <SocialProof />
        <Testimonials />
        <FAQ />
      </main>
      <FinalCTA />
      <FloatingActions />
      <Chatbot />
    </>
  );
}

export default App;
