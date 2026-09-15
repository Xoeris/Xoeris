import React, { useState, useEffect } from 'react';
import {
  Menu, X, ChevronRight, ArrowRight, Smartphone,
  Globe, Music, Cpu, Zap, Shield, Layers, Film, Joystick, Cloud,
  Database, Activity, TrendingUp
} from 'lucide-react';
import FadeIn from './components/FadeIn';

const FamilyCard = ({ title, desc, icon: Icon, family, onNavigate, color, pngIcon }) => (
  <FadeIn>
    <div
      onClick={() => onNavigate(family)}
      className="group relative bg-hide-primary border border-hide-border-subtle p-8 rounded-hide-xl cursor-pointer hover:bg-hide-hover hover:border-hide-border-default transition-all duration-500 overflow-hidden h-full flex flex-col justify-between"
    >
      {/* Accent top border on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-hide-accent transition-all duration-1000"></div>
      <div>
        <div className="w-20 h-20 rounded-hide-lg bg-hide-elevated flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
          {pngIcon ? (
            <img src={pngIcon} alt={title} className="w-12 h-12 object-contain" />
          ) : (
            <Icon size={32} style={{ color: color }} />
          )}
        </div>
        <h3 className="text-2xl font-black mb-4 tracking-tight uppercase">{title}</h3>
        <p className="text-hide-text-muted leading-relaxed font-medium mb-8 group-hover:text-hide-text-secondary transition-colors">{desc}</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-hide-accent">
        Explore Family <ChevronRight size={16} />
      </div>
    </div>
  </FadeIn>
);

export default function XoerisPage({ onNavigate }) {
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

  const families = [
    { title: "Illucine", family: "illucine", icon: Film, color: "#FFC94A", desc: "Advanced animation pipelines and real-time film creation frameworks.", pngIcon: "/xoeris_illucine_logo_icon_2026.png" },
    { title: "Elarion", family: "elarion", icon: Joystick, color: "#FFC94A", desc: "Interconnected apps, 3D engines (Horizone), and optical Neurolens (ACTON).", pngIcon: "/xoeris_elarion_logo_colored.png" }
  ];

  return (
    <div className="relative z-10 w-full">
      {/* Global Navigation */}
      <nav className={`fixed w-full z-[200] transition-all duration-500 ${isScrolled ? 'py-4 shadow-hide-popup backdrop-blur-2xl bg-hide-sunken/60 border-b border-hide-border-subtle' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <button onClick={() => onNavigate('xoeris')} className="flex items-center group bg-transparent border-none">
            <div className="h-10 w-40 transition-transform duration-500 group-hover:scale-105">
               <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="w-full h-full object-contain object-left" />
            </div>
          </button>

          {/* Families Mega Menu Link (Desktop) */}
          <div className="hidden lg:flex items-center gap-10">
            {families.map((f) => (
              <button
                key={f.title}
                onClick={() => onNavigate(f.family)}
                className="text-hide-base font-bold uppercase tracking-[0.15em] text-hide-text-muted hover:text-hide-text-primary transition-all duration-hide-fast hover:translate-y-[-2px]"
              >
                {f.title}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => onNavigate('subscriptions')} className="text-xs font-bold uppercase tracking-widest text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast">Pricing</button>
            <button
              onClick={() => onNavigate('acelbyte')}
              className="px-6 py-3 bg-hide-action text-hide-action-text text-[11px] font-bold uppercase tracking-widest rounded-hide-lg hover:bg-hide-action-hover hover:scale-105 transition-all duration-hide-fast"
            >
              Enterprise
            </button>
          </div>

          <button className="lg:hidden text-hide-text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-hide-canvas/95 backdrop-blur-3xl border-t border-hide-border-subtle py-10 px-6 flex flex-col gap-8">
            {families.map(f => (
              <button key={f.title} onClick={() => { onNavigate(f.family); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest text-left text-hide-accent">{f.title}</button>
            ))}
            <div className="h-px w-full bg-hide-border-subtle"></div>
          </div>
        )}
      </nav>

      {/* Hero: The Intelligence Core */}
      <section className="relative pt-60 pb-32 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden min-h-screen">
        <FadeIn className="relative z-10 max-w-5xl">
          <div className="flex justify-center mb-10">
            <img src="/xoeris_logo_emblem.png" alt="XOERIS" className="h-28 md:h-44 object-contain" />
          </div>
          <p className="text-xl md:text-2xl text-hide-text-secondary mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
            Xoeris develops software platforms, operating system modules, and digital tools tailored to streamline professional animation and application workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => onNavigate('elarion-horizone')} className="group flex items-center gap-3 px-10 py-5 bg-hide-action text-hide-action-text text-sm font-bold uppercase tracking-widest rounded-hide-lg hover:bg-hide-action-hover hover:scale-105 transition-all duration-hide-fast shadow-[0_20px_50px_rgba(0,200,150,0.25)]">
              Explore Horizone <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button onClick={() => onNavigate('acelbyte')} className="flex items-center gap-3 px-10 py-5 bg-hide-ghost border border-hide-border-subtle text-hide-text-primary text-sm font-bold uppercase tracking-widest rounded-hide-lg hover:bg-hide-hover transition-all duration-hide-fast backdrop-blur-md">
              View Documentation
            </button>
          </div>
        </FadeIn>

        {/* Abstract Background Element (The Core) — uses amber glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hide-accent rounded-full blur-[200px] opacity-[0.06] pointer-events-none animate-pulse"></div>
      </section>

      {/* The Family Universe Grid */}
      <section className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto relative">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-hide-accent uppercase tracking-[0.4em] mb-6">Our Portfolio</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">EXPLORE PRODUCT <br/> FAMILIES.</h3>
            </div>
            <p className="text-hide-text-muted font-bold uppercase tracking-widest text-xs border-l-2 border-hide-accent pl-6 py-2">
              Cross-Platform <br/> Integration
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {families.map((f, i) => (
            <FamilyCard key={f.title} {...f} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Global Scale Section */}
      <section className="py-32 bg-hide-primary/50 border-y border-hide-border-subtle relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <h2 className="text-sm font-bold text-hide-accent uppercase tracking-[0.4em] mb-8">Modular OS Platform</h2>
            <img src="/xime_logo_text.png" alt="XIME" className="h-16 md:h-24 object-contain mb-10" />
            <p className="text-xl text-hide-text-secondary leading-relaxed mb-12 font-medium">
              Xoeris Interactive Modular Ecosystem (XIME) is a modular operating system platform developed by Xoeris, providing a unified foundation for system services, user interfaces, media, applications, and interactive experiences.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-black text-hide-text-primary mb-2">99.9%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-hide-text-muted">Service Availability</div>
              </div>
              <div>
                <div className="text-3xl font-black text-hide-text-primary mb-2">&lt; 1ms</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-hide-text-muted">Response Latency</div>
              </div>
            </div>
          </FadeIn>
          <div className="relative">
             <div className="aspect-square bg-hide-primary border border-hide-border-subtle rounded-hide-xl flex items-center justify-center overflow-hidden">
                <Cpu size={200} className="text-hide-text-disabled/20 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-hide-canvas via-transparent to-transparent"></div>
             </div>
             <div className="absolute -bottom-10 -left-10 p-8 bg-hide-canvas border border-hide-border-subtle rounded-hide-lg shadow-hide-popup backdrop-blur-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-hide-lg bg-hide-action flex items-center justify-center"><Layers size={20} className="text-hide-action-text" /></div>
                  <div className="font-bold text-sm uppercase tracking-tighter">Unified OS Architecture</div>
                </div>
                <p className="text-hide-base text-hide-text-muted leading-tight">Synchronizing ecosystem nodes.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Unified Footer */}
      <footer className="pt-32 pb-16 px-6 md:px-12 bg-hide-canvas">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-32">
            <div className="col-span-2">
              <button onClick={() => onNavigate('xoeris')} className="flex items-center mb-10 group bg-transparent border-none">
                <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="h-10 w-40 object-contain object-left" />
              </button>
              <p className="text-hide-text-muted font-medium max-w-xs leading-relaxed mb-10">
                Pioneering professional software ecosystems and interactive modular environments.
              </p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-hide-lg bg-hide-elevated border border-hide-border-subtle flex items-center justify-center text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast cursor-pointer"><Globe size={18}/></div>
                 <div className="w-10 h-10 rounded-hide-lg bg-hide-elevated border border-hide-border-subtle flex items-center justify-center text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast cursor-pointer"><Shield size={18}/></div>
              </div>
            </div>

            {/* Link Groups */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-hide-text-primary mb-8">Families</h4>
              <ul className="space-y-4">
                {["Illucine", "Elarion"].map(l => (
                  <li key={l}><button onClick={() => onNavigate(l.toLowerCase())} className="text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast text-sm font-medium bg-transparent border-none p-0">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-hide-text-primary mb-8">Developers</h4>
              <ul className="space-y-4">
                {["API Docs"].map(l => (
                  <li key={l}><button onClick={() => onNavigate('developers')} className="text-sm font-medium text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast bg-transparent border-none p-0">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-hide-text-primary mb-8">Company</h4>
              <ul className="space-y-4">
                {["About"].map(l => (
                  <li key={l}><button onClick={() => onNavigate('about')} className="text-sm font-medium text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast bg-transparent border-none p-0">{l}</button></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-hide-border-subtle flex flex-col md:flex-row justify-between items-center gap-8 text-hide-text-muted text-[10px] font-bold uppercase tracking-widest">
            <p>© 2020-2026 Xoeris</p>
            <div className="flex gap-10">
              <button className="hover:text-hide-text-primary transition-colors duration-hide-fast">Privacy Policy</button>
              <button className="hover:text-hide-text-primary transition-colors duration-hide-fast">Terms of Service</button>
              <button className="hover:text-hide-text-primary transition-colors duration-hide-fast">EULA</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
