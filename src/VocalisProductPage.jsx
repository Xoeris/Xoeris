import React from 'react';
import { ProductLayout, FeatureShowcase, TechStats } from './components/XoerisShared';
import { Mic2, Music, Waves } from 'lucide-react';

export default function VocalisProductPage({ onNavigate }) {
  const audioFeatures = [
    { name: "Neural Noise Isolation", desc: "Real-time AI filtering that removes 99.9% of background interference while preserving harmonic depth." },
    { name: "Spatial Phase Correction", desc: "Automatically aligns phase across multi-mic arrays for perfect stereo and Atmos imaging." },
    { name: "Harmonic Reconstruction", desc: "XESC-powered upscaling of compressed or low-fidelity audio sources to studio-grade 192kHz." }
  ];

  const captureFeatures = [
    { name: "Biometric Voice Sync", desc: "Encrypt and identify audio streams based on unique vocal signatures at the OS level." },
    { name: "Zero-Latency Monitoring", desc: "Direct hardware path to Sonic-H transducers for sub-1ms monitoring performance." },
    { name: "Ariasphere Cloud Link", desc: "Instant upload of raw stems to Drivon for collaborative sessions in Aria-DAW." }
  ];

  const stats = [
    { label: "Sample Rate", value: "384 kHz" },
    { label: "Bit Depth", value: "32-bit" },
    { label: "SNR", value: "124 dB" },
    { label: "Latency", value: "< 0.5ms" }
  ];

  return (
    <ProductLayout
      name="Vocalis"
      family="Ariasphere"
      familyRoute="ariasphere"
      tagline="Neural Audio Capture Interface"
      description="Vocalis is the professional standard for high-fidelity audio acquisition. Combining laboratory-grade transducers with XESC neural processing."
      color="#EC4899"
      icon={Mic2}
      onNavigate={onNavigate}
    >
      <TechStats title="Acoustic Benchmarks" stats={stats} />

      <FeatureShowcase
        title="Sonic Purity"
        items={audioFeatures}
      />

      <FeatureShowcase
        title="Intelligent Workflow"
        items={captureFeatures}
        reverse={true}
      />

      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-gradient-to-b from-transparent to-[#EC4899]/10">
         <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase">Master the Sound.</h3>
         <p className="text-gray-400 max-w-xl mb-12 text-lg">Vocalis hardware and software suites are now available for professional studios and independent creators.</p>
         <button className="px-12 py-6 bg-[#EC4899] text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(236,72,153,0.3)]">Explore Vocalis Hardware</button>
      </section>
    </ProductLayout>
  );
}
