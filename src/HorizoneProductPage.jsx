import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';

export default function HorizoneProductPage({ onNavigate }) {
  const engineFeatures = [
    { name: "Zenith Real-time Physics", desc: "Native integration with Zenith engine for accurate, low-latency physical interactions." },
    { name: "Volumetric Neurolens", desc: "Advanced light simulation system designed for photorealistic environment capturing." },
    { name: "XESC Scripting Hub", desc: "Direct AI-assisted scripting and automation using the Xoeris Enhanced System Computing." }
  ];

  const workflowFeatures = [
    { name: "Unified Asset Cloud", desc: "Direct synchronization with Drivon for instant access to high-fidelity 3D assets." },
    { name: "Multi-Platform Export", desc: "Deploy to Xoeris OS, Mobile, and high-performance server clusters with one click." },
    { name: "Real-time Collaboration", desc: "Low-latency node-based editing synchronized across global Netwave connections." }
  ];

  const stats = [
    { label: "Rendering Latency", value: "< 2ms" },
    { label: "Max Polygon Count", value: "Unlimited*" },
    { label: "AI Sync Rate", value: "120 Hz" },
    { label: "Zenith Integration", value: "v4.0" }
  ];

  return (
    <ProductLayout
      name="Horizone"
      family="Elarion"
      familyRoute="elarion"
      tagline="The Engine of Digital Reality"
      description="Professional 3D creation suite engineered for real-time fidelity. Build immersive worlds, simulate complex physics, and deploy at global scale."
      color="#705EBC"
      pngIcon="/xoeris_voltrix_horizone_logo_icon_colored.png"
      onNavigate={onNavigate}
    >
      <TechStats title="Performance Benchmarks" stats={stats} />

      <FeatureShowcase
        title="Computational Core"
        items={engineFeatures}
      />

      <FeatureShowcase
        title="Integrated Workflow"
        items={workflowFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#705EBC]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Get Started.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Join the architects and developers building the Xoeris ecosystem with Horizone.</p>
         <button className="px-12 py-6 bg-[#705EBC] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(112,94,188,0.4)]">Get Horizone Early Access</button>
      </section>
    </ProductLayout>
  );
}
