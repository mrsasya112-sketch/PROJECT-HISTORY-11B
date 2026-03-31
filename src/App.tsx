import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Pricing from "./components/Pricing";
import WhyMe from "./components/WhyMe";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingBanner from "./components/FloatingBanner";

export default function App() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 font-sans text-slate-800 antialiased">
      <Hero />
      <About />
      <Services />
      <WhyMe />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
      <AnimatePresence>
        {showBanner && <FloatingBanner onClose={() => setShowBanner(false)} />}
      </AnimatePresence>
    </div>
  );
}
