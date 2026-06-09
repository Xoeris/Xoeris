import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';
import { Terminal, Shield, Cpu } from 'lucide-react';

export default function AetherOSProductPage({ onNavigate }) {
  const osFeatures = [
    { name: "Micro-Kernel Core", desc: "A highly modular kernel designed for security and extreme performance across heterogeneous hardware." },
    { name: "Native XESC Runtime", desc: "Intelligence is baked into the OS level, enabling system-wide AI-assisted task scheduling." },
    { name: "Netwave Mesh Overlay", desc: "Built-in networking stack that treats the entire global node mesh as a single local network." }
  ];

  const developerFeatures = [
    { name: "Zenith Hardware Abstraction", desc: "Write code once and run it on any Zenith-certified hardware with native performance." },
    { name: "Immutable System State", desc: "Roll back system updates or configuration changes instantly with Drivon-backed snapshots." },
    { name: "Secure Sandbox", desc: "Every application runs in a hardware-isolated environment with fine-grained capability controls." }
  ];

  const stats = [
    { label: "Kernel Size", value: "2.4 MB" },
    { label: "Boot Time", value: "< 1.5s" },
    { label: "Security", value: "Level 7" },
    { label: "Node Sync", value: "Real-time" }
  ];

  return (
    <ProductLayout
      name="Aether OS"
      family="Aetheris"
      familyRoute="aetheris"
      tagline="The Unified Operating Environment"
      description="Aether OS is the foundational software layer for the Xoeris ecosystem. It provides a secure, high-performance, and intelligently-orchestrated environment for all your digital needs."
      color="#10B981"
      icon={Terminal}
      onNavigate={onNavigate}
    >
      <TechStats title="System Efficiency" stats={stats} />

      <FeatureShowcase
        title="Foundation of Power"
        items={osFeatures}
      />

      <FeatureShowcase
        title="Built for Architects"
        items={developerFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#10B981]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Redefine Your Interface.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Aether OS is now available for Xoeris Zenith workstations and Netwave node clusters.</p>
         <button className="px-12 py-6 bg-[#10B981] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)]">Get Aether OS for Desktop</button>
      </section>
    </ProductLayout>
  );
}
