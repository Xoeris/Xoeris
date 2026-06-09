import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';
import { Gamepad2, Shield, Swords } from 'lucide-react';

export default function AmberlordProductPage({ onNavigate }) {
  const gameplayFeatures = [
    { name: "Zenith Physics Integration", desc: "Every interaction is governed by the core Zenith engine, ensuring 1:1 physical realism." },
    { name: "XESC Life Simulation", desc: "Non-player characters driven by full XESC neural networks, with unique memories and evolving goals." },
    { name: "Infinite World Generation", desc: "Procedural world-building that expands dynamically based on Netwave node availability." }
  ];

  const techFeatures = [
    { name: "Aetheris Data Stream", desc: "Your progress and identity are decentralized across Aetheris nodes, accessible from any device." },
    { name: "Volumetric Soundscape", desc: "Fully immersive spatial audio powered by Ariasphere's Sonic-H transducer algorithms." },
    { name: "Neural Interface Support", desc: "Direct compatibility with experimental bio-feedback sensors for deeper immersion." }
  ];

  const stats = [
    { label: "World Scale", value: "Infinite" },
    { label: "Entity Count", value: "10M+" },
    { label: "Tick Rate", value: "128 Hz" },
    { label: "Zenith Sync", value: "v4.0" }
  ];

  return (
    <ProductLayout
      name="Amberlord"
      family="Elarion"
      familyRoute="elarion"
      tagline="Next-Generation Interactive Universe"
      description="Amberlord is more than a game—it's a living, breathing digital universe powered by the full Xoeris technology stack. Explore, create, and survive in an infinite world."
      color="#705EBC"
      icon={Gamepad2}
      onNavigate={onNavigate}
    >
      <TechStats title="Universal Metrics" stats={stats} />

      <FeatureShowcase
        title="Living Mechanics"
        items={gameplayFeatures}
      />

      <FeatureShowcase
        title="Ecosystem Core"
        items={techFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#705EBC]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Enter the Epoch.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Amberlord is currently in closed alpha for Zenith node operators. Register your interest for the next wave of access.</p>
         <button className="px-12 py-6 bg-[#705EBC] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(112,94,188,0.4)]">Apply for Alpha Access</button>
      </section>
    </ProductLayout>
  );
}
