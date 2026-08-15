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
    <div className="relative z-10 w-full min-h-screen bg-black text-white">
      {/* Global Navigation */}
      <nav className={`fixed w-full z-[200] transition-all duration-500 ${isScrolled ? 'py-4 shadow-2xl backdrop-blur-2xl bg-black/60 border-b border-white/5' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <button onClick={() => onNavigate('xoeris')} className="flex items-center group bg-transparent border-none">
            <div className="h-10 w-40 transition-transform duration-500 group-hover:scale-105">
               <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="w-full h-full object-contain object-left" />
            </div>
          </button>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-10">
            <button onClick={() => onNavigate('illucine')} className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-all hover:translate-y-[-2px]">Illucine</button>
            <button onClick={() => onNavigate('elarion')} className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-all hover:translate-y-[-2px]">Elarion</button>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => onNavigate('subscriptions')} className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">Pricing</button>
            <button
              onClick={() => onNavigate('acelbyte')}
              className="px-6 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
            >
              Enterprise
            </button>
          </div>

          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-t border-white/5 py-10 px-6 flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <button onClick={() => { onNavigate('illucine'); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest text-left text-[#F59E0B]">Illucine</button>
            <button onClick={() => { onNavigate('elarion'); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest text-left text-[#705EBC]">Elarion</button>
            <div className="h-px w-full bg-white/10"></div>
            <button onClick={() => onNavigate('acelbyte')} className="text-lg font-bold text-gray-400">Back to Acelbyte</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-60 pb-32 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        <FadeIn className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mb-10 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">
            Developing Professional <br/> Software Platforms
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
            Xoeris is a software engineering and product design firm dedicated to creating interconnected digital applications, specialized operating systems, and developer tools.
          </p>
        </FadeIn>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#705EBC] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
      </section>

      {/* Core Mission & Vision */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <h2 className="text-xs font-black text-[#705EBC] uppercase tracking-[0.4em] mb-4">Our Mission</h2>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-6">INTEGRATING SYSTEM AND UTILITY</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
              We design tools and systems that combine robust computational performance with intuitive user design. From real-time rendering pipelines to core OS modules, our priority is workflow optimization.
            </p>
          </FadeIn>
          <FadeIn>
            <h2 className="text-xs font-black text-[#705EBC] uppercase tracking-[0.4em] mb-4">Our Vision</h2>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-6">THE MODULAR ECOSYSTEM</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
              We envision software architectures that are built on modular, high-performance components. XIME represents the framework for this vision, delivering scalability and ease of integration.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto border-t border-white/5">
        <FadeIn>
          <h2 className="text-xs font-black text-[#705EBC] uppercase tracking-[0.4em] mb-12 text-center">Core Pillars</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          <FadeIn>
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <Cpu className="text-[#705EBC] mb-6" size={32} />
              <h4 className="text-xl font-black uppercase tracking-tight mb-4">Performance First</h4>
              <p className="text-gray-400 text-sm leading-relaxed">System-level optimization. We build responsive, low-latency architectures designed to handle intensive operations with high efficiency.</p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <Layers className="text-[#705EBC] mb-6" size={32} />
              <h4 className="text-xl font-black uppercase tracking-tight mb-4">Modular Design</h4>
              <p className="text-gray-400 text-sm leading-relaxed">System flexibility. Software features are structured as independent components that integrate seamlessly across platform nodes.</p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <Shield className="text-[#705EBC] mb-6" size={32} />
              <h4 className="text-xl font-black uppercase tracking-tight mb-4">Security</h4>
              <p className="text-gray-400 text-sm leading-relaxed">Reliable and stable operations. Built to ensure data protection and runtime stability across all connected applications.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Unified Footer */}
      <footer className="pt-24 pb-16 px-6 md:px-12 bg-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <button onClick={() => onNavigate('xoeris')} className="flex items-center mb-10 group bg-transparent border-none">
                <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="h-10 w-40 object-contain object-left" />
              </button>
              <p className="text-gray-500 font-medium max-w-xs leading-relaxed mb-10">
                Pioneering professional software ecosystems and interactive modular environments.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Families</h4>
              <ul className="space-y-4">
                {["Illucine", "Elarion"].map(l => (
                  <li key={l}><button onClick={() => onNavigate(l.toLowerCase())} className="text-[#a1a1aa] hover:text-white transition-colors text-sm font-medium bg-transparent border-none p-0">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Company</h4>
              <ul className="space-y-4">
                {["About"].map(l => (
                  <li key={l}><button onClick={() => onNavigate('about')} className="text-sm font-medium text-gray-500 hover:text-white transition-colors bg-transparent border-none p-0">{l}</button></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-[10px] font-black uppercase tracking-widest">
            <p>© 2020-2026 Xoeris</p>
            <div className="flex gap-10">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
