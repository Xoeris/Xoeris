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
      className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] cursor-pointer hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-current transition-all duration-1000" style={{ color: color }}></div>
      <div>
        <div className="w-20 h-20 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
          {pngIcon ? (
            <img src={pngIcon} alt={title} className="w-12 h-12 object-contain" />
          ) : (
            <Icon size={32} style={{ color: color }} />
          )}
        </div>
        <h3 className="text-2xl font-black mb-4 tracking-tight uppercase">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-medium mb-8 group-hover:text-gray-300 transition-colors">{desc}</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest" style={{ color: color }}>
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
    { title: "Illucine", family: "illucine", icon: Film, color: "#F59E0B", desc: "Advanced animation pipelines and real-time film creation frameworks.", pngIcon: "/xoeris_illucine_logo_icon_2026.png" },
    { title: "Elarion", family: "elarion", icon: Joystick, color: "#705EBC", desc: "Interconnected apps, 3D engines (Horizone), and optical Neurolens (ACTON).", pngIcon: "/xoeris_elarion_logo_colored.png" }
  ];

  return (
    <div className="relative z-10 w-full">
      {/* Global Navigation */}
      <nav className={`fixed w-full z-[200] transition-all duration-500 ${isScrolled ? 'py-4 shadow-2xl backdrop-blur-2xl bg-black/60 border-b border-white/5' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-3 group bg-transparent border-none">
            <div className="w-12 h-12 transition-transform duration-500 group-hover:scale-110">
               <img src="/xoeris-logo.png" alt="Xoeris" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black tracking-[0.2em] text-white">XOERIS</span>
          </button>

          {/* Families Mega Menu Link (Desktop) */}
          <div className="hidden lg:flex items-center gap-10">
            {families.map((f) => (
              <button
                key={f.title}
                onClick={() => onNavigate(f.family)}
                className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-all hover:translate-y-[-2px]"
              >
                {f.title}
              </button>
            ))}
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
            {families.map(f => (
              <button key={f.title} onClick={() => { onNavigate(f.family); setMobileMenuOpen(false); }} className="text-2xl font-black uppercase tracking-widest text-left" style={{ color: f.color }}>{f.title}</button>
            ))}
            <div className="h-px w-full bg-white/10"></div>
            <button onClick={() => onNavigate('acelbyte')} className="text-lg font-bold text-gray-400">Back to Acelbyte</button>
          </div>
        )}
      </nav>

      {/* Hero: The Intelligence Core */}
      <section className="relative pt-60 pb-32 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden min-h-screen">
        <FadeIn className="relative z-10 max-w-5xl">
          <h1 className="text-7xl md:text-9xl font-black leading-[0.95] mb-10 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-600">
            XOERIS
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
            Xoeris is a multi-layered technology ecosystem converging advanced computing, AI frameworks, and professional creative tools into a single interconnected universe.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => onNavigate('elarion-horizone')} className="group flex items-center gap-3 px-10 py-5 bg-[#705EBC] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(112,94,188,0.3)]">
              Explore Horizone <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button onClick={() => onNavigate('acelbyte')} className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md">
              View Whitepapers
            </button>
          </div>
        </FadeIn>

        {/* Abstract Background Element (The Core) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#705EBC] rounded-full blur-[200px] opacity-10 pointer-events-none animate-pulse"></div>
      </section>

      {/* The Family Universe Grid */}
      <section className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto relative">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-[#705EBC] uppercase tracking-[0.4em] mb-6">The Universe</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">EXPLORE THE <br/> FAMILIES.</h3>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs border-l-2 border-[#705EBC] pl-6 py-2">
              Cross-Platform <br/> Synchronization
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
      <section className="py-32 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Zenith Engine</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-tight">BUILT FOR THE <br/> NEXT EPOCH.</h3>
            <p className="text-xl text-gray-400 leading-relaxed mb-12 font-medium">
              Every Xoeris product is powered by the Zenith Engine. From the physics in Amberlord to the data processing in XESC, Zenith provides the raw computational force required for real-time synchronization.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-black text-white mb-2">99.9%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Uptime Reliability</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-2">&lt; 1ms</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node Latency</div>
              </div>
            </div>
          </FadeIn>
          <div className="relative">
             <div className="aspect-square bg-white/[0.03] rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                <Cpu size={200} className="text-white/10 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
             </div>
             <div className="absolute -bottom-10 -left-10 p-8 bg-black border border-white/10 rounded-2xl shadow-2xl backdrop-blur-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#705EBC] flex items-center justify-center"><Layers size={20}/></div>
                  <div className="font-black text-sm uppercase tracking-tighter">Unified OS Architecture</div>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">Synchronizing 12M+ devices across Netwave nodes.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Unified Footer */}
      <footer className="pt-32 pb-16 px-6 md:px-12 bg-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-32">
            <div className="col-span-2">
              <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-3 mb-10 group bg-transparent border-none">
                <img src="/xoeris-logo.png" alt="Xoeris" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-black tracking-widest text-white">XOERIS</span>
              </button>
              <p className="text-gray-500 font-medium max-w-xs leading-relaxed mb-10">
                Pioneering the intersection of intelligence and artistic expression through a unified technology stack.
              </p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"><Globe size={18}/></div>
                 <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"><Shield size={18}/></div>
              </div>
            </div>

            {/* Link Groups */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Families</h4>
              <ul className="space-y-4">
                {["Illucine", "Elarion"].map(l => (
                  <li key={l}><button onClick={() => onNavigate(l.toLowerCase())} className="text-[#a1a1aa] hover:text-white transition-colors text-sm font-medium bg-transparent border-none p-0">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Platform</h4>
              <ul className="space-y-4">
                {[
                  { name: "XESC AI", route: "aetheris-xesc" },
                  { name: "Drivon Cloud", route: "aetheris-drivon" },
                  { name: "Horizone 3D", route: "elarion-horizone" },
                  { name: "ACTON Lens", route: "elarion-acton" },
                  { name: "Amberlord", route: "elarion-amberlord" }
                ].map(l => (
                  <li key={l.name}><button onClick={() => onNavigate(l.route)} className="text-sm font-medium text-gray-500 hover:text-white transition-colors bg-transparent border-none p-0">{l.name}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Developers</h4>
              <ul className="space-y-4">
                {["API Docs", "SDK Downloads", "System Status", "Dev Forum", "Research"].map(l => (
                  <li key={l}><button onClick={() => onNavigate('developers')} className="text-sm font-medium text-gray-500 hover:text-white transition-colors bg-transparent border-none p-0">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Company</h4>
              <ul className="space-y-4">
                {["About", "Enterprise", "Careers", "Newsroom", "Legal"].map(l => (
                  <li key={l}><button onClick={() => onNavigate('acelbyte')} className="text-sm font-medium text-gray-500 hover:text-white transition-colors bg-transparent border-none p-0">{l}</button></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-[10px] font-black uppercase tracking-widest">
            <p>© 2020-2026 Xoeris</p>
            <div className="flex gap-10">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">EULA</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
