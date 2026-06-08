import React from 'react';
import { ChevronRight, ArrowLeft, ArrowUpRight, CheckCircle2, Terminal, Cpu, Globe, Zap } from 'lucide-react';
import FadeIn from './FadeIn';

/**
 * FAMILY LAYOUT
 * The main container for family hub pages.
 */
export const FamilyLayout = ({ title, tagline, description, color, children, onNavigate, pngIcon }) => (
  <div className="min-h-screen bg-black text-white">
    <nav className="fixed top-0 w-full z-[150] bg-black/60 backdrop-blur-xl border-b border-white/5 py-4">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors bg-transparent border-none">
          <ArrowLeft size={14} /> Core
        </button>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             {pngIcon && <img src={pngIcon} alt={title} className="w-5 h-5 object-contain" />}
             <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color }}>{title}</span>
          </div>
          <div className="hidden md:flex gap-6">
            {['Overview', 'Products', 'Tech Specs', 'Research'].map(item => (
              <button key={item} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors bg-transparent border-none">{item}</button>
            ))}
          </div>
        </div>
        <button onClick={() => onNavigate('acelbyte')} className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform">Enterprise</button>
      </div>
    </nav>

    <section className="relative pt-48 pb-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
      <FadeIn className="z-10 max-w-4xl flex flex-col items-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] mb-8" style={{ color }}>
          {pngIcon && <img src={pngIcon} alt="" className="w-3 h-3 object-contain" />}
          Xoeris Family Node: {title}
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight uppercase">
          {tagline || title}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">{description}</p>
      </FadeIn>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ backgroundColor: color }}></div>
    </section>

    {children}
  </div>
);

/**
 * PRODUCT GRID
 * Displays sub-products in family hubs.
 */
export const ProductGrid = ({ products, onNavigate, color }) => (
  <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p) => (
        <FadeIn key={p.name}>
          <div
            onClick={() => onNavigate(p.route)}
            className="group bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 h-[400px] flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                {p.pngIcon ? (
                  <img src={p.pngIcon} alt={p.name} className="w-10 h-10 object-contain" />
                ) : (
                  p.icon && <p.icon size={32} style={{ color }} />
                )}
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">{p.name}</h3>
              <p className="text-gray-500 font-medium leading-relaxed group-hover:text-gray-300 transition-colors">{p.desc}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color }}>
              View Details <ChevronRight size={14} />
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

/**
 * PRODUCT LAYOUT
 * The main container for specific product deep-dive pages.
 */
export const ProductLayout = ({ name, family, familyRoute, tagline, description, color, children, onNavigate, pngIcon }) => (
  <div className="min-h-screen bg-black text-white">
    <nav className="fixed top-0 w-full z-[150] bg-black/80 backdrop-blur-xl border-b border-white/5 py-4">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <button onClick={() => onNavigate(familyRoute)} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors bg-transparent border-none">
          <ArrowLeft size={14} /> {family}
        </button>
        <div className="flex items-center gap-3">
           {pngIcon && <img src={pngIcon} alt={name} className="w-5 h-5 object-contain" />}
           <span className="text-xs font-black uppercase tracking-[0.2em]">{name}</span>
        </div>
        <div className="hidden lg:flex gap-8">
           {['Overview', 'Capabilities', 'Docs', 'Downloads'].map(item => (
             <button key={item} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors bg-transparent border-none">{item}</button>
           ))}
        </div>
        <button className="px-6 py-2 bg-[#705EBC] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform">Get Access</button>
      </div>
    </nav>

    <section className="relative pt-48 pb-32 px-6 md:px-12 flex flex-col items-center text-center">
      <FadeIn className="max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-widest mb-10 text-gray-400">
           Part of <span style={{ color }}>{family}</span> Ecosystem
        </div>
        <h1 className="text-6xl md:text-[7rem] font-black leading-[0.9] tracking-tighter mb-10 uppercase">{name}</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-tight" style={{ color }}>{tagline}</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-16">{description}</p>
        <div className="flex gap-4 justify-center">
           <button className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">Download Suite</button>
           <button className="px-10 py-5 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md">Documentation</button>
        </div>
      </FadeIn>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-video bg-gradient-to-b from-white/[0.02] to-transparent rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </section>

    {children}

    <footer className="py-20 border-t border-white/5 bg-white/[0.01]">
       <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
             <img src="/xoeris-logo.png" alt="Xoeris" className="w-8 h-8 object-contain" />
             <span className="text-sm font-black uppercase tracking-widest text-gray-400">Powered by Zenith Engine</span>
          </div>
          <div className="flex gap-10">
             <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Privacy</button>
             <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Terms</button>
             <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Dev Portal</button>
          </div>
       </div>
    </footer>
  </div>
);

/**
 * FEATURE SHOWCASE
 * Horizontal blocks for highlighting product capabilities.
 */
export const FeatureShowcase = ({ title, items, reverse }) => (
  <section className={`py-24 px-6 md:px-12 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-20 items-center ${reverse ? 'direction-rtl' : ''}`}>
    <FadeIn className={reverse ? 'lg:order-2' : ''}>
      <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 uppercase">{title}</h3>
      <div className="space-y-8">
        {items.map((item, i) => (
          <div key={i} className="flex gap-6 group">
            <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#705EBC]/20 transition-colors">
              <CheckCircle2 size={20} className="text-[#705EBC]" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{item.name}</h4>
              <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
    <FadeIn delay={200} className={`relative aspect-video bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden flex items-center justify-center ${reverse ? 'lg:order-1' : ''}`}>
       <div className="absolute inset-0 bg-gradient-to-tr from-[#705EBC]/10 to-transparent opacity-50"></div>
       <Zap size={100} className="text-white/5" />
       {/* Placeholder for high-res screenshot or video */}
       <div className="absolute bottom-6 left-6 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
          <Terminal size={14} className="text-[#705EBC]" />
          <span className="text-[9px] font-black uppercase tracking-widest">Real-time Visualization Active</span>
       </div>
    </FadeIn>
  </section>
);

/**
 * TECHNICAL STATS
 * High-density statistics for R&D/Zenith nodes.
 */
export const TechStats = ({ title, stats }) => (
  <section className="py-24 bg-white/[0.02] border-y border-white/5">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-16 text-center">{title}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((s, i) => (
          <FadeIn key={i} delay={i * 100} className="text-center">
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">{s.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{s.label}</div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);
