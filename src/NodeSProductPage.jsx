import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';
import { Radio, Globe, Zap } from 'lucide-react';

export default function NodeSProductPage({ onNavigate }) {
  const networkFeatures = [
    { name: "Satellite Link 2.0", desc: "Integrated orbital transceiver for global coverage, even in the most remote maritime zones." },
    { name: "Mesh Handover", desc: "Seamless switching between local Netwave nodes and satellite links with zero packet loss." },
    { name: "Quantum-Key Distribution", desc: "Secure data transmission protected by Voltrix-researched hardware encryption." }
  ];

  const deploymentFeatures = [
    { name: "All-Weather Housing", desc: "Designed for extreme maritime and high-altitude environments. IP69K certified." },
    { name: "Solar-Ready Power", desc: "Optimized for Voltrix Ion-X power cells and SAMUDRA solar management arrays." },
    { name: "Autonomous Diagnostics", desc: "Self-healing network logic that bypasses failed nodes via XESC pathfinding." }
  ];

  const stats = [
    { label: "Bandwidth", value: "10 Gb/s" },
    { label: "Range", value: "Global" },
    { label: "Latency (Sat)", value: "24ms" },
    { label: "Latency (Mesh)", value: "< 1ms" }
  ];

  return (
    <ProductLayout
      name="Node-S"
      family="Netwave"
      familyRoute="netwave"
      tagline="Global Connectivity Node"
      description="Node-S is the physical backbone of the Netwave network. A rugged, high-performance connectivity hub designed for universal deployment."
      color="#3B82F6"
      icon={Radio}
      onNavigate={onNavigate}
    >
      <TechStats title="Network Benchmarks" stats={stats} />

      <FeatureShowcase
        title="Universal Link"
        items={networkFeatures}
      />

      <FeatureShowcase
        title="Resilient Edge"
        items={deploymentFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#3B82F6]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Connect Everything.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Node-S is now shipping to enterprise maritime and logistics partners globally.</p>
         <button className="px-12 py-6 bg-[#3B82F6] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)]">Inquire for Deployment</button>
      </section>
    </ProductLayout>
  );
}
