import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import FadeIn from './FadeIn';

export const FamilyLayout = ({ title, tagline, description, color, children, onNavigate, pngIcon }) => (
  <div className="min-h-screen bg-black text-white">
    {/* Sub-navigation */}
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

    {/* Hero */}
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
