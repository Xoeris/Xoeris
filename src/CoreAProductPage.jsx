import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';
import { Cpu, Zap, Activity } from 'lucide-react';

export default function CoreAProductPage({ onNavigate }) {
  const archFeatures = [
    { name: "Heterogeneous Computing", desc: "A unified fabric combining scalar, vector, and neural processing units in a single die." },
    { name: "Optical Interconnect", desc: "Sub-nanosecond communication between Core-A clusters via integrated photonic paths." },
    { name: "Zenith Instruction Set", desc: "A custom ISA optimized for real-time physics and XESC neural inference logic." }
  ];

  const thermalFeatures = [
    { name: "Cryo-V Integration", desc: "Designed for direct liquid-to-chip cooling systems for sustained 6GHz+ performance." },
    { name: "Atomic Power Gating", desc: "Ultra-fine power control that shuts down unused clusters in nanoseconds to maximize efficiency." },
    { name: "Neural Load Balancing", desc: "XESC-driven task distribution that anticipates computational spikes before they occur." }
  ];

  const stats = [
    { label: "Transistor Count", value: "2.4T" },
    { label: "Clock Speed", value: "6.2 GHz" },
    { label: "AI Perf", value: "1200 TOPS" },
    { label: "Process", value: "1.2nm" }
  ];

  return (
    <ProductLayout
      name="Core-A"
      family="Zenith"
      familyRoute="zenith"
      tagline="Foundational Silicon Architecture"
      description="Core-A is the heart of the Xoeris ecosystem. A revolutionary processor architecture engineered for the most demanding computational tasks."
      color="#EF4444"
      icon={Cpu}
      onNavigate={onNavigate}
    >
      <TechStats title="Hardware Metrics" stats={stats} />

      <FeatureShowcase
        title="Silicon Logic"
        items={archFeatures}
      />

      <FeatureShowcase
        title="Thermal Mastery"
        items={thermalFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#EF4444]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Power the Next Era.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Core-A architecture is currently available for Zenith-class workstations and high-performance clusters.</p>
         <button className="px-12 py-6 bg-[#EF4444] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(239,68,68,0.3)]">View Architecture Whitepapers</button>
      </section>
    </ProductLayout>
  );
}
