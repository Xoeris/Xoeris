import React from 'react';
import { ChevronRight, ArrowLeft, ArrowUpRight, CheckCircle2, Terminal, Cpu, Globe, Zap } from 'lucide-react';
import FadeIn from './FadeIn';

/**
 * FAMILY LAYOUT
 * The main container for family hub pages.
 * Uses HIDE tokens: sunken nav, subtle borders, muted back-button, accent badge.
 */
export const FamilyLayout = ({ title, tagline, description, color, children, onNavigate, pngIcon }) => (
  <div className="min-h-screen bg-hide-canvas text-hide-text-primary">
    <nav className="fixed top-0 w-full z-[150] bg-hide-sunken/80 backdrop-blur-xl border-b border-hide-border-subtle py-4">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-2 text-hide-base font-semibold uppercase tracking-[0.2em] text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast bg-transparent border-none">
          <ArrowLeft size={14} /> Core
        </button>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             {pngIcon && <img src={pngIcon} alt={title} className="w-5 h-5 object-contain" />}
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color }}>{title}</span>
          </div>
          <div className="hidden md:flex gap-6">
            {['Overview', 'Products', 'Tech Specs', 'Research'].map(item => (
              <button key={item} className="text-[10px] font-semibold uppercase tracking-widest text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast bg-transparent border-none">{item}</button>
            ))}
          </div>
        </div>
        <button onClick={() => onNavigate('acelbyte')} className="px-5 py-2 bg-hide-action text-hide-action-text text-[10px] font-bold uppercase tracking-widest rounded-hide-lg hover:bg-hide-action-hover hover:scale-105 transition-all duration-hide-fast">Enterprise</button>
      </div>
    </nav>

    <section className="relative pt-48 pb-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
      <FadeIn className="z-10 max-w-4xl flex flex-col items-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-hide-lg bg-hide-elevated/60 border border-hide-border-subtle text-[9px] font-bold uppercase tracking-[0.3em] mb-8" style={{ color }}>
          {pngIcon && <img src={pngIcon} alt="" className="w-3 h-3 object-contain" />}
          Xoeris Family Node: {title}
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight uppercase">
          {tagline || title}
        </h1>
        <p className="text-xl text-hide-text-secondary max-w-2xl mx-auto leading-relaxed mb-12 font-medium">{description}</p>
      </FadeIn>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ backgroundColor: color }}></div>
    </section>

    {children}
  </div>
);

/**
 * PRODUCT GRID
 * Displays sub-products in family hubs.
 * Cards: elevated bg, subtle border, house radius (6px), hover → 2D3139.
 */
export const ProductGrid = ({ products, onNavigate, color }) => (
  <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p) => (
        <FadeIn key={p.name}>
          <div
            onClick={() => onNavigate(p.route)}
            className="group bg-hide-primary border border-hide-border-subtle p-10 rounded-hide-xl cursor-pointer hover:bg-hide-hover hover:border-hide-border-default transition-all duration-hide-medium h-[400px] flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="w-16 h-16 rounded-hide-lg bg-hide-elevated flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                {p.pngIcon ? (
                  <img src={p.pngIcon} alt={p.name} className="w-10 h-10 object-contain" />
                ) : (
                  p.icon && <p.icon size={32} style={{ color }} />
                )}
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">{p.name}</h3>
              <p className="text-hide-text-muted font-medium leading-relaxed group-hover:text-hide-text-secondary transition-colors">{p.desc}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color }}>
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
 * Nav: sunken bg, subtle border. CTA → action green. Footer uses muted text.
 */
export const ProductLayout = ({ name, family, familyRoute, tagline, description, color, children, onNavigate, pngIcon }) => (
  <div className="min-h-screen bg-hide-canvas text-hide-text-primary">
    <nav className="fixed top-0 w-full z-[150] bg-hide-sunken/80 backdrop-blur-xl border-b border-hide-border-subtle py-4">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <button onClick={() => onNavigate(familyRoute)} className="flex items-center gap-2 text-hide-base font-semibold uppercase tracking-[0.2em] text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast bg-transparent border-none">
          <ArrowLeft size={14} /> {family}
        </button>
        <div className="flex items-center gap-3">
           {pngIcon && <img src={pngIcon} alt={name} className="w-5 h-5 object-contain" />}
           <span className="text-xs font-bold uppercase tracking-[0.2em]">{name}</span>
        </div>
        <div className="hidden lg:flex gap-8">
           {['Overview', 'Capabilities', 'Docs', 'Downloads'].map(item => (
             <button key={item} className="text-[10px] font-semibold uppercase tracking-widest text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast bg-transparent border-none">{item}</button>
           ))}
        </div>
        <button className="px-6 py-2 bg-hide-action text-hide-action-text text-[10px] font-bold uppercase tracking-widest rounded-hide-lg hover:bg-hide-action-hover hover:scale-105 transition-all duration-hide-fast">Get Access</button>
      </div>
    </nav>

    <section className="relative pt-48 pb-32 px-6 md:px-12 flex flex-col items-center text-center">
      <FadeIn className="max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-hide-lg bg-hide-elevated/60 border border-hide-border-subtle text-[9px] font-bold uppercase tracking-widest mb-10 text-hide-text-muted">
           Part of <span style={{ color }}>{family}</span> Ecosystem
        </div>
        <h1 className="text-6xl md:text-[7rem] font-black leading-[0.9] tracking-tighter mb-10 uppercase">{name}</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-tight" style={{ color }}>{tagline}</h2>
        <p className="text-xl text-hide-text-secondary max-w-2xl mx-auto leading-relaxed mb-16">{description}</p>
        <div className="flex gap-4 justify-center">
           <button className="px-10 py-5 bg-hide-action text-hide-action-text text-xs font-bold uppercase tracking-widest rounded-hide-lg hover:bg-hide-action-hover hover:scale-105 transition-all duration-hide-fast">Download Suite</button>
           <button className="px-10 py-5 bg-hide-ghost border border-hide-border-subtle text-hide-text-primary text-xs font-bold uppercase tracking-widest rounded-hide-lg hover:bg-hide-hover transition-all duration-hide-fast backdrop-blur-md">Documentation</button>
        </div>
      </FadeIn>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-video bg-gradient-to-b from-white/[0.02] to-transparent rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </section>

    {children}

    <footer className="py-20 border-t border-hide-border-subtle bg-hide-primary/30">
       <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
             <img src="/xoeris-logo.png" alt="Xoeris" className="w-8 h-8 object-contain" />
             <span className="text-sm font-bold uppercase tracking-widest text-hide-text-muted">Powered by Zenith Engine</span>
          </div>
          <div className="flex gap-10">
             <button className="text-[10px] font-bold uppercase tracking-widest text-hide-text-disabled hover:text-hide-text-primary transition-colors duration-hide-fast">Privacy</button>
             <button className="text-[10px] font-bold uppercase tracking-widest text-hide-text-disabled hover:text-hide-text-primary transition-colors duration-hide-fast">Terms</button>
             <button className="text-[10px] font-bold uppercase tracking-widest text-hide-text-disabled hover:text-hide-text-primary transition-colors duration-hide-fast">Dev Portal</button>
          </div>
       </div>
    </footer>
  </div>
);

/**
 * FEATURE SHOWCASE
 * Horizontal blocks for highlighting product capabilities.
 * Check icons → action teal (#00C896). Cards use HIDE surfaces.
 */
export const FeatureShowcase = ({ title, items, reverse }) => (
  <section className={`py-24 px-6 md:px-12 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-20 items-center ${reverse ? 'direction-rtl' : ''}`}>
    <FadeIn className={reverse ? 'lg:order-2' : ''}>
      <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 uppercase">{title}</h3>
      <div className="space-y-8">
        {items.map((item, i) => (
          <div key={i} className="flex gap-6 group">
            <div className="w-12 h-12 rounded-hide-lg bg-hide-elevated border border-hide-border-subtle flex items-center justify-center shrink-0 group-hover:bg-hide-action/20 transition-colors duration-hide-fast">
              <CheckCircle2 size={20} className="text-hide-action" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2 group-hover:text-hide-text-emphasis transition-colors">{item.name}</h4>
              <p className="text-hide-text-muted font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
    <FadeIn delay={200} className={`relative aspect-video bg-hide-primary border border-hide-border-subtle rounded-hide-xl overflow-hidden flex items-center justify-center ${reverse ? 'lg:order-1' : ''}`}>
       <div className="absolute inset-0 bg-gradient-to-tr from-hide-action/10 to-transparent opacity-50"></div>
       <Zap size={100} className="text-white/5" />
       {/* Placeholder for high-res screenshot or video */}
       <div className="absolute bottom-6 left-6 p-4 bg-hide-canvas/60 backdrop-blur-md rounded-hide-lg border border-hide-border-subtle flex items-center gap-3">
          <Terminal size={14} className="text-hide-action" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Real-time Visualization Active</span>
       </div>
    </FadeIn>
  </section>
);

/**
 * TECHNICAL STATS
 * High-density statistics for R&D/Zenith nodes.
 */
export const TechStats = ({ title, stats }) => (
  <section className="py-24 bg-hide-primary/50 border-y border-hide-border-subtle">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-hide-text-muted mb-16 text-center">{title}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((s, i) => (
          <FadeIn key={i} delay={i * 100} className="text-center">
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-hide-text-muted">{s.label}</div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);
