import React from 'react'
import HeroSection from '../components/hero/HeroSection'
import EcosystemSection from '../components/sections/EcosystemSection'
import LeavingSoonSection from '../components/sections/LeavingSoonSection'
import ServicesGrid from '../components/sections/ServicesGrid'
import TouristPlanner from '../components/sections/TouristPlanner'
import WhereWeGoSection from '../components/sections/WhereWeGoSection'
import WhyChooseSection from '../components/sections/WhyChooseSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import PartnersCarousel from '../components/sections/PartnersCarousel'
import Footer from '../components/layout/Footer'
import AIAssistant from '../components/ui/AIAssistant'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <EcosystemSection />
      <LeavingSoonSection />
      <ServicesGrid />
      <WhereWeGoSection />
      <TouristPlanner />
      <WhyChooseSection />
      <TestimonialsSection />
      <PartnersCarousel />
      <Footer />
      <AIAssistant />
    </main>
  )
}
