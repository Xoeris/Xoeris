import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';

export default function XESCProductPage({ onNavigate }) {
  const aiFeatures = [
    { name: "Neural Logic Overlap", desc: "Advanced decision-making frameworks that operate with biological-level inference speeds." },
    { name: "Self-Optimizing Core", desc: "Autonomous parameter tuning based on Zenith computational availability." },
    { name: "Global Node Sync", desc: "Instantly distribute intelligence updates across the entire Netwave infrastructure." }
  ];

  const integrationFeatures = [
    { name: "Zero-Latency API", desc: "Direct hardware-level access to XESC inference engines for third-party developers." },
    { name: "Multimodal Perception", desc: "Process audio (Ariasphere) and visual (Illucine) data streams in a single unified model." },
    { name: "Privacy First", desc: "Decentralized intelligence processing ensuring data stays within the secure Xoeris perimeter." }
  ];

  const stats = [
    { label: "Inference Speed", value: "850 TFLOPS" },
    { label: "Neural Nodes", value: "1.2M+" },
    { label: "Sync Latency", value: "< 0.5ms" },
    { label: "Framework Ver.", value: "9.6.1" }
  ];

  return (
    <ProductLayout
      name="XESC"
      family="Aetheris"
      familyRoute="aetheris"
      tagline="Autonomous Neural Intelligence"
      description="Xoeris Enhanced System Computing. The cognitive architecture powering every autonomous system, AI framework, and high-level logic node in the ecosystem."
      color="#10B981"
      pngIcon="/xesc_icon.png"
      onNavigate={onNavigate}
    >
      <TechStats title="Neural Performance" stats={stats} />

      <FeatureShowcase
        title="Infinite Intelligence"
        items={aiFeatures}
      />

      <FeatureShowcase
        title="Deep Integration"
        items={integrationFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#10B981]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Integrate Thought.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Build the next generation of autonomous applications with the XESC Neural SDK.</p>
         <button className="px-12 py-6 bg-[#10B981] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)]">View Dev Documentation</button>
      </section>
    </ProductLayout>
  );
}
