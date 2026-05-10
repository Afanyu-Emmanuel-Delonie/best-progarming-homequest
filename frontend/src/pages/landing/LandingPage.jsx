import HeroSection        from "../../components/landing/HeroSection"
import FeaturedProperties from "../../components/landing/FeaturedProperties"
import HowItWorks         from "../../components/landing/HowItWorks"
import WhyUs              from "../../components/landing/WhyUs"
import TopAgents          from "../../components/landing/TopAgents"
import AboutSection       from "../../components/landing/AboutSection"
import Testimonials       from "../../components/landing/Testimonials"
import ContactSection     from "../../components/landing/ContactSection"
import CTASection         from "../../components/landing/CTASection"

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProperties />
      <div id="how-it-works"><HowItWorks /></div>
      <WhyUs />
      <TopAgents />
      <div id="about"><AboutSection /></div>
      <Testimonials />
      <div id="contact"><ContactSection /></div>
      <CTASection />
    </main>
  )
}
