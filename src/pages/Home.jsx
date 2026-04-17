import React from 'react'
import HeroSection from '../components/hero/HeroSection'
import LeavingSoonSection from '../components/sections/LeavingSoonSection'
import ParcelHireSection from '../components/sections/ParcelHireSection'
import ServicesGrid from '../components/sections/ServicesGrid'
import WhereWeGoSection from '../components/sections/WhereWeGoSection'
import TouristPlanner from '../components/sections/TouristPlanner'
import WhyChooseSection from '../components/sections/WhyChooseSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import PartnersCarousel from '../components/sections/PartnersCarousel'
import Footer from '../components/layout/Footer'
import AIAssistant from '../components/ui/AIAssistant'

/* Hidden portal nav -- not visible to passengers, accessible via direct URL */
function HiddenPortalLinks() {
  return (
    <div aria-hidden="true" style={{ position:'absolute', left:'-9999px', top:0, width:1, height:1, overflow:'hidden' }}>
      <a href="/admin">Admin Portal</a>
      <a href="/operator">Operator Portal</a>
    </div>
  )
}

export default function Home() {
  return (
    <main style={{ position:'relative' }}>
      <HiddenPortalLinks />
      <HeroSection />
      <LeavingSoonSection />
      <ParcelHireSection />
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
