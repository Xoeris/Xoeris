import React from 'react';
import { FamilyLayout, ProductGrid } from './components/XoerisShared';
import { Box, Eye, Gamepad2 } from 'lucide-react';

export default function ElarionPage({ onNavigate }) {
  const products = [
    { id: 1, name: "Horizone", route: "elarion-horizone", pngIcon: "/xoeris_voltrix_horizone_logo_icon_colored.png", desc: "Professional 3D engine and world-building suite for real-time applications." },
    { id: 2, name: "ACTON", route: "elarion-acton", icon: Eye, desc: "Advanced Camera Technology Optical Neurolens for high-fidelity spatial capturing." },
    { id: 3, name: "Amberlord", route: "elarion-amberlord", icon: Gamepad2, desc: "Next-generation open-world interactive experience powered by Zenith." }
  ];

  return (
    <FamilyLayout
      title="Elarion"
      tagline="Creative Suites & Engines"
      description="Developing the tools that bridge the gap between imagination and digital reality. From high-performance 3D engines to optical sensory hardware."
      color="#705EBC"
      pngIcon="/xoeris_elarion_logo_colored.png"
      onNavigate={onNavigate}
    >
      <ProductGrid products={products} onNavigate={onNavigate} color="#705EBC" />
    </FamilyLayout>
  );
}
