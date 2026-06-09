import React from 'react';
import { FamilyLayout, ProductGrid } from './components/XoerisShared';
import { Film, Camera, Video } from 'lucide-react';

export default function IllucinePage({ onNavigate }) {
  const products = [
    { id: 1, name: "Prism", route: "illucine-prism", icon: Camera, desc: "A real-time cinematic rendering pipeline for high-fidelity film production." },
    { id: 2, name: "Motion-S", route: "illucine", icon: Video, desc: "Neural motion capture framework that translates human performance into digital data." },
    { id: 3, name: "Frame-X", route: "illucine", icon: Film, desc: "The foundational video encoding protocol designed for the Xoeris ecosystem." }
  ];

  return (
    <FamilyLayout
      title="Illucine"
      tagline="Cinematic Frameworks"
      description="Redefining visual storytelling. Implementing professional-grade animation and film pipelines that operate at the speed of thought."
      color="#F59E0B"
      onNavigate={onNavigate}
    >
      <ProductGrid products={products} onNavigate={onNavigate} color="#F59E0B" />
    </FamilyLayout>
  );
}
