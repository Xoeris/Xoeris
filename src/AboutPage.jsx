import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, ArrowRight, Shield, Globe, Cpu, Layers } from 'lucide-react';
import FadeIn from './components/FadeIn';

export default function AboutPage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <div className="relative z-10 w-full min-h-screen bg-[#050505] text-white selection:bg-[#FDD935] selection:text-black overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-[-2] bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      {/* Shared Animated Background Blobs */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen gpu-accel">
        <div className="blob blob-1 will-change-transform" style={{ backgroundColor: '#FDD935' }}></div>
        <div className="blob blob-2 will-change-transform" style={{ backgroundColor: '#FFC94A' }}></div>
        <div className="blob blob-3 will-change-transform" style={{ backgroundColor: '#FEF08A' }}></div>
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[60px]"></div>
      </div>

      {/* Global Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <div
          className="absolute inset-0 pointer-events-none liquid-glass-panel border-b border-white/10"
          style={{ backdropFilter: 'blur(28px) saturate(190%)', WebkitBackdropFilter: 'blur(28px) saturate(190%)' }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative z-10">
          <button onClick={() => { window.location.href = 'https://xoeris.com'; }} className="flex items-center group bg-transparent border-none p-0 cursor-pointer">
            <div className="h-10 w-40 transition-transform duration-300 group-hover:scale-105">
               <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="w-full h-full object-contain object-left" />
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => onNavigate('pricing')} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer">Pricing</button>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-5 py-2.5 bg-[#FDD935] text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_20px_rgba(253,217,53,0.3)]"
            >
              Get Started
            </button>
          </div>

          <button className="lg:hidden text-[#FDD935] bg-transparent border-none p-0 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-t border-white/10 py-8 px-6 flex flex-col gap-6">
            <button onClick={() => { onNavigate('pricing'); setMobileMenuOpen(false); }} className="text-xl font-bold uppercase tracking-wider text-left text-[#FDD935] bg-transparent border-none">Pricing</button>
            <div className="h-px w-full bg-white/10"></div>
            <button onClick={() => { onNavigate('xoeris'); setMobileMenuOpen(false); }} className="text-base font-semibold text-gray-400 bg-transparent border-none text-left">Back to Home</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-28 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden max-w-7xl mx-auto">
        <FadeIn className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-8 tracking-tight uppercase text-white">
            Developing Professional <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#FFC94A]">Software Platforms</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal mb-8">
            Xoeris is an advanced software engineering and product research ecosystem dedicated to interconnected neural networks, modular platforms, and intelligent developer tools.
          </p>
        </FadeIn>
      </section>

      {/* Core Mission & Vision */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <FadeIn className="liquid-glass-panel border border-white/15 rounded-3xl p-8 sm:p-10 ring-1 ring-white/10" style={{ backdropFilter: 'blur(28px) saturate(180%)' }}>
            <h2 className="text-xs font-bold text-[#FDD935] uppercase tracking-[0.4em] mb-4">Our Mission</h2>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-white">INTEGRATING SYSTEM AND UTILITY</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              We design tools and systems that combine robust computational performance with intuitive user design. From real-time rendering pipelines to core OS modules, our priority is workflow optimization.
            </p>
          </FadeIn>
          <FadeIn className="liquid-glass-panel border border-white/15 rounded-3xl p-8 sm:p-10 ring-1 ring-white/10" style={{ backdropFilter: 'blur(28px) saturate(180%)' }}>
            <h2 className="text-xs font-bold text-[#FDD935] uppercase tracking-[0.4em] mb-4">Our Vision</h2>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-white">THE MODULAR ECOSYSTEM</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              We envision software architectures that are built on modular, high-performance components. XIME represents the framework for this vision, delivering scalability and ease of integration.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <FadeIn>
          <h2 className="text-xs font-bold text-[#FDD935] uppercase tracking-[0.4em] mb-12 text-center">Core Pillars</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          <FadeIn>
            <div className="p-8 rounded-3xl liquid-glass-panel border border-white/15 hover:border-[#FDD935]/40 transition-colors" style={{ backdropFilter: 'blur(28px) saturate(180%)' }}>
              <Cpu className="text-[#FDD935] mb-6" size={32} />
              <h4 className="text-lg font-bold uppercase tracking-tight mb-3 text-white">Performance First</h4>
              <p className="text-gray-400 text-sm leading-relaxed">System-level optimization. We build responsive, low-latency architectures designed to handle intensive operations with high efficiency.</p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="p-8 rounded-3xl liquid-glass-panel border border-white/15 hover:border-[#FDD935]/40 transition-colors" style={{ backdropFilter: 'blur(28px) saturate(180%)' }}>
              <Layers className="text-[#FDD935] mb-6" size={32} />
              <h4 className="text-lg font-bold uppercase tracking-tight mb-3 text-white">Modular Design</h4>
              <p className="text-gray-400 text-sm leading-relaxed">System flexibility. Software features are structured as independent components that integrate directly across platform nodes.</p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="p-8 rounded-3xl liquid-glass-panel border border-white/15 hover:border-[#FDD935]/40 transition-colors" style={{ backdropFilter: 'blur(28px) saturate(180%)' }}>
              <Shield className="text-[#FDD935] mb-6" size={32} />
              <h4 className="text-lg font-bold uppercase tracking-tight mb-3 text-white">Security</h4>
              <p className="text-gray-400 text-sm leading-relaxed">Reliable and stable operations. Built to ensure data protection and runtime stability across all connected applications.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Unified Footer */}
      <footer className="pt-20 pb-16 px-6 md:px-12 bg-black/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div>
              <button onClick={() => { window.location.href = 'https://xoeris.com'; }} className="flex items-center mb-6 group bg-transparent border-none p-0 cursor-pointer">
                <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="h-10 w-40 object-contain object-left" />
              </button>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                Pioneering professional software ecosystems and interactive modular environments.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Company</h4>
              <ul className="space-y-3">
                {["About"].map(l => (
                  <li key={l}><button onClick={() => onNavigate('about')} className="text-sm font-semibold text-gray-300 hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer">{l}</button></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-xs">
            <p>© 2018-2026 Xoeris. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer">Privacy Policy</button>
              <button className="hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
