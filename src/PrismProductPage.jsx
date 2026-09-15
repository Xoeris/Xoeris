import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';
import { Camera, Film, Layers } from 'lucide-react';

export default function PrismProductPage({ onNavigate }) {
  const renderingFeatures = [
    { name: "Real-time Ray Sync", desc: "Native Zenith-powered ray tracing that matches physical light behavior in real-time." },
    { name: "Neural Denoising", desc: "XESC-integrated denoiser that cleans up complex renders in milliseconds without losing detail." },
    { name: "Volumetric Shaders", desc: "Advanced light scattering for realistic atmosphere, fog, and underwater effects." }
  ];

  const pipelineFeatures = [
    { name: "Frame-X Encoding", desc: "Direct export to the high-efficiency Illucine video protocol with zero quality loss." },
    { name: "Multi-Node Rendering", desc: "Distribute massive render tasks across Netwave-connected Zenith clusters automatically." },
    { name: "Live Set Integration", desc: "Synchronize virtual Prism environments with ACTON-captured physical footage instantly." }
  ];

  const stats = [
    { label: "Render Speed", value: "Real-time" },
    { label: "Color Depth", value: "16-bit" },
    { label: "Resolution", value: "8K+" },
    { label: "Sync Engine", value: "Prism v5" }
  ];

  return (
    <ProductLayout
      name="Prism"
      family="Illucine"
      familyRoute="illucine"
      tagline="Cinematic Rendering Engine"
      description="Prism is the core rendering pipeline for the next generation of digital storytelling. High-fidelity, real-time, and fully integrated with the Xoeris ecosystem."
      color="#FFC94A"
      icon={Camera}
      onNavigate={onNavigate}
    >
      <TechStats title="Visual Performance" stats={stats} />

      <FeatureShowcase
        title="Light & Shadow"
        items={renderingFeatures}
      />

      <FeatureShowcase
        title="Production Pipeline"
        items={pipelineFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-hide-accent/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Direct the Future.</h3>
         <p className="text-hide-text-secondary max-w-xl mb-12 text-lg">Prism is currently powering the world's most advanced virtual production stages.</p>
         <button className="px-12 py-6 bg-hide-action text-hide-action-text text-sm font-bold uppercase tracking-widest rounded-hide-lg hover:bg-hide-action-hover hover:scale-105 transition-all duration-hide-fast shadow-[0_20px_50px_rgba(0,200,150,0.3)]">Request Studio Demo</button>
      </section>
    </ProductLayout>
  );
}
