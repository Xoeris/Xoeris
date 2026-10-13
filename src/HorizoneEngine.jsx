import React from 'react';
import { ArrowRight, Box, CheckCircle2 } from 'lucide-react';
import SoftwareLayout from './components/SoftwareLayout';
import FadeIn from './components/FadeIn';

export default function HorizoneEngine({ onNavigate }) {
  const features = [
    {
      title: "Vulkan 1.3 & DX12 Next-Gen Render Pipeline",
      desc: "Hardware-accelerated real-time ray tracing, nanite-style geometric clustering, and async compute queues for photorealistic graphics.",
      badge: "Rendering"
    },
    {
      title: "Deterministic Entity-Component-System (ECS)",
      desc: "Data-oriented architecture optimizing cache lines and memory layout, scaling up to hundreds of thousands of dynamic entities.",
      badge: "Core Architecture"
    },
    {
      title: "Real-Time Spatial Audio & Acoustic Simulation",
      desc: "Wave-based sound propagation with dynamic occlusion, directional reverb, and native integration with Ariasphere audio drivers.",
      badge: "Spatial Sound"
    },
    {
      title: "Cross-Platform Unified Compiler Pipeline",
      desc: "One-click compilation for Desktop (Windows, macOS, Linux), Android mobile, and web targets with WebGPU compatibility.",
      badge: "Target Support"
    }
  ];

  const engineSpecs = [
    { label: "Render Backend", value: "Vulkan 1.3 / DX12 / Metal 3" },
    { label: "Physics Engine", value: "Multi-threaded Constraint Solver" },
    { label: "Shading Model", value: "PBR Material Graph with Live Preview" },
    { label: "Scripting Runtimes", value: "C++23 Native, Rust, & Xalme Script" }
  ];

  return (
    <SoftwareLayout
      title="Horizone Engine"
      subtitle="Real-Time Simulation & 3D Interactive Runtime"
      onNavigate={onNavigate}
    >
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn className="max-w-4xl flex flex-col items-center">
          <img 
            src="/xoeris_horizone_engine_logo_icon_colored.png" 
            alt="Horizone Engine" 
            className="w-20 h-20 mb-6 object-contain drop-shadow-[0_0_25px_rgba(253,217,53,0.35)]" 
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FDD935] uppercase tracking-widest mb-8 backdrop-blur-md">
            <Box size={14} className="text-[#FDD935]" />
            Real-Time Simulation & 3D Interactive Runtime
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
            Horizone <span className="text-[#FDD935]">Engine.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed mb-12">
            The next-generation interactive 3D and computational simulation engine designed for uncompromising visual fidelity, raw performance, and modular extensibility.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate ? onNavigate('horizoneide') : window.location.href = '/horizoneide'}
              className="px-8 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(253,217,53,0.4)] flex items-center gap-2 cursor-pointer border-none"
            >
              Open in Horizone IDE <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer"
            >
              Pricing & Plans
            </button>
          </div>
        </FadeIn>
      </section>

      {/* Engine Matrix */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
          {engineSpecs.map((spec, i) => (
            <FadeIn key={i} delay={i * 80} className="border-l-2 border-[#FDD935]/40 pl-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935] mb-1">{spec.label}</div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">{spec.value}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Simulation Capabilities</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Craft Reality at Any Scale.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FDD935]/50 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col justify-between group">
                <div>
                  <div className="inline-block px-3 py-1 rounded-lg bg-[#FDD935]/10 border border-[#FDD935]/20 text-[10px] font-bold text-[#FDD935] uppercase tracking-wider mb-6">
                    {item.badge}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-[#FDD935] transition-colors">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm font-normal">{item.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span>Hardware Accelerated</span>
                  <CheckCircle2 size={16} className="text-[#FDD935]" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#FDD935]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">Start Building Worlds.</h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base mb-10 font-normal">
            Harness the power of Horizone Engine via Horizone IDE with built-in Xalme AI assistant support.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate ? onNavigate('horizoneide') : window.location.href = '/horizoneide'}
              className="px-10 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_25px_rgba(253,217,53,0.35)]"
            >
              Explore Horizone IDE
            </button>
            <button 
              onClick={() => { window.location.href = 'https://xoeris.com'; }}
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              Back to Xoeris
            </button>
          </div>
        </div>
      </section>
    </SoftwareLayout>
  );
}
