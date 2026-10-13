import React from 'react';
import { ArrowRight, Music, CheckCircle2 } from 'lucide-react';
import SoftwareLayout from './components/SoftwareLayout';
import FadeIn from './components/FadeIn';

export default function Musify({ onNavigate }) {
  const features = [
    {
      title: "Lossless 384 kHz / 32-bit Mastering",
      desc: "Zero-quantization distortion with dynamic bit-perfect floating-point playback and stem separation algorithms.",
      badge: "Audiophile Grade"
    },
    {
      title: "Harmonic Neural Stem Separation",
      desc: "Split vocals, drums, bass, and complex polyphonic instrumentation cleanly using deep auditory wave transformation.",
      badge: "AI Decomposition"
    },
    {
      title: "Spatial Atmos & Binaural Head Tracking",
      desc: "Real-time binaural rendering for studio monitors and headphones, crafting immersive 360-degree acoustic stages.",
      badge: "Spatial Audio"
    },
    {
      title: "Seamless Vocalis & DAW Interconnect",
      desc: "Native bridge to Ariasphere Vocalis hardware interfaces and modern digital audio workstations with zero latency.",
      badge: "Studio Integration"
    }
  ];

  const specs = [
    { label: "Sampling Resolution", value: "384 kHz / 32-bit Float" },
    { label: "Signal-to-Noise Ratio", value: "132 dB Dynamic Range" },
    { label: "Engine Processing", value: "Low-Latency DSP Pipeline" },
    { label: "Stem Separation Speed", value: "24x Realtime Inference" }
  ];

  return (
    <SoftwareLayout
      title="Musify"
      subtitle="High-Resolution Acoustic Intelligence & Sound Architecture"
      onNavigate={onNavigate}
    >
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn className="max-w-4xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FDD935] uppercase tracking-widest mb-8 backdrop-blur-md">
            <Music size={14} className="text-[#FDD935]" />
            High-Resolution Acoustic Intelligence & Sound Architecture
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
            Musify <span className="text-[#FDD935]">Audio.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed mb-12">
            The studio-grade acoustic workstation for mastering, neural stem isolation, and high-fidelity binaural reproduction.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate ? onNavigate('chat') : window.location.href = '/chat'}
              className="px-8 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(253,217,53,0.4)] flex items-center gap-2 cursor-pointer border-none"
            >
              Try with Xalme <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer"
            >
              View Plans
            </button>
          </div>
        </FadeIn>
      </section>

      {/* Specs Matrix */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
          {specs.map((spec, i) => (
            <FadeIn key={i} delay={i * 80} className="border-l-2 border-[#FDD935]/40 pl-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935] mb-1">{spec.label}</div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">{spec.value}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Sound Engineering</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Pure Waveform Precision.</h2>
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
                  <span>Bit-Perfect Pipeline</span>
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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FDD935]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">Hear Beyond Boundaries.</h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base mb-10 font-normal">
            Musify is part of the Xoeris software ecosystem. Available to all Pro and Ultra members.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-10 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_25px_rgba(253,217,53,0.35)]"
            >
              Get Musify on Pro
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
