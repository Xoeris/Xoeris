import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';
import { Eye, Focus, Target } from 'lucide-react';

export default function ACTONProductPage({ onNavigate }) {
  const lensFeatures = [
    { name: "Neuromorphic Focus", desc: "Adaptive focus algorithms that mimic human eye response times for natural depth of field." },
    { name: "Spectral Depth Map", desc: "Captures 12-bit depth information per pixel, enabling perfect post-production relighting." },
    { name: "Zenith Optical Sync", desc: "Zero-latency synchronization between physical lens position and Horizone virtual cameras." }
  ];

  const captureFeatures = [
    { name: "Volumetric Streaming", desc: "Stream raw 3D spatial data directly to Drivon nodes for real-time remote collaboration." },
    { name: "Multi-Spectrum Imaging", desc: "Simultaneously capture visible, infrared, and ultraviolet light for advanced scientific analysis." },
    { name: "AI Motion Prediction", desc: "XESC-powered predictive tracking that anticipates subject movement to maintain perfect framing." }
  ];

  const stats = [
    { label: "Spatial Res", value: "32K" },
    { label: "Depth Layers", value: "4096" },
    { label: "Data Rate", value: "8 Gb/s" },
    { label: "Latency", value: "< 0.1ms" }
  ];

  return (
    <ProductLayout
      name="ACTON"
      family="Elarion"
      familyRoute="elarion"
      tagline="Advanced Camera Technology Optical Neurolens"
      description="The definitive hardware interface for spatial capturing. ACTON bridges the physical and digital worlds with unparalleled optical precision and neural integration."
      color="#705EBC"
      icon={Eye}
      onNavigate={onNavigate}
    >
      <TechStats title="Optical Performance" stats={stats} />

      <FeatureShowcase
        title="Neural Optics"
        items={lensFeatures}
      />

      <FeatureShowcase
        title="Spatial Intelligence"
        items={captureFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#705EBC]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">See the Invisible.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Experience the next generation of spatial capturing with ACTON. Available for authorized R&D partners.</p>
         <button className="px-12 py-6 bg-[#705EBC] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(112,94,188,0.4)]">Request Technical Specs</button>
      </section>
    </ProductLayout>
  );
}
