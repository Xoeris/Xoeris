import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';

export default function DrivonProductPage({ onNavigate }) {
  const storageFeatures = [
    { name: "Zero-G Synchronization", desc: "Proprietary protocol for instant data mirroring across high-altitude and orbital nodes." },
    { name: "Quantum Encryption", desc: "Hardware-level security derived from Voltrix research to ensure total data sovereignty." },
    { name: "Atomic Retrieval", desc: "File indexing and retrieval speeds that match native SSD performance over the network." }
  ];

  const cloudFeatures = [
    { name: "Elastic Compute", desc: "Dynamically scale Zenith GPU power to your Drivon storage for cloud-based rendering." },
    { name: "Node Federation", desc: "Decentralized architecture that automatically routes data through the fastest Netwave path." },
    { name: "Archive Horizon", desc: "Long-term 'cold' storage with sub-second wake times for massive data archives." }
  ];

  const stats = [
    { label: "Global Nodes", value: "24,000+" },
    { label: "Uptime Sync", value: "99.999%" },
    { label: "Avg Throughput", value: "1.2 TB/s" },
    { label: "Encryption", value: "X-AES" }
  ];

  return (
    <ProductLayout
      name="Drivon"
      family="Aetheris"
      familyRoute="aetheris"
      tagline="Distributed Data Infinity"
      description="The definitive storage and cloud ecosystem for Xoeris. Secure, decentralized, and synchronized at the speed of light."
      color="#10B981"
      pngIcon="/xoeris_aetherislogo.png"
      onNavigate={onNavigate}
    >
      <TechStats title="Network Sovereignty" stats={stats} />

      <FeatureShowcase
        title="Immutable Storage"
        items={storageFeatures}
      />

      <FeatureShowcase
        title="Cloud Architecture"
        items={cloudFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#10B981]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Secure Your Data.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Migrate your infrastructure to the most resilient distributed network ever built.</p>
         <button className="px-12 py-6 bg-[#10B981] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)]">Get Enterprise Quote</button>
      </section>
    </ProductLayout>
  );
}
