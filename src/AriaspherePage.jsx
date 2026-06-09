import React from 'react';
import { FamilyLayout, ProductGrid } from './components/XoerisShared';
import { Speaker, Music2, Mic2 } from 'lucide-react';

export default function AriaspherePage({ onNavigate }) {
  const products = [
    { id: 1, name: "Vocalis", route: "ariasphere-vocalis", icon: Mic2, desc: "Neural audio capture technology that isolates performance with laboratory precision." },
    { id: 2, name: "Aria-DAW", route: "ariasphere", icon: Music2, desc: "The next-generation digital audio workstation designed for spatial acoustic modeling." },
    { id: 3, name: "Sonic-H", route: "ariasphere", icon: Speaker, desc: "High-fidelity transducer systems that reproduce sound with zero distortion." }
  ];

  return (
    <FamilyLayout
      title="Ariasphere"
      tagline="Sonic & Acoustic Mastery"
      description="The fusion of sound and mathematics. Crafting immersive auditory experiences through advanced signal processing and neural synthesis."
      color="#EC4899"
      onNavigate={onNavigate}
    >
      <ProductGrid products={products} onNavigate={onNavigate} color="#EC4899" />
    </FamilyLayout>
  );
}
