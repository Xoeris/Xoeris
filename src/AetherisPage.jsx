import React from 'react';
import { FamilyLayout, ProductGrid } from './components/XoerisShared';
import { Brain, Cloud, Terminal } from 'lucide-react';

export default function AetherisPage({ onNavigate }) {
  const products = [
    { id: 1, name: "XESC", route: "aetheris-xesc", pngIcon: "/xesc_icon.png", desc: "Xoeris Enhanced System Computing. A neural processing framework for autonomous intelligence." },
    { id: 2, name: "Drivon", route: "aetheris-drivon", icon: Cloud, desc: "Distributed storage and cloud synchronization systems with zero-latency retrieval." },
    { id: 3, name: "Aether OS", route: "aetheris", icon: Terminal, desc: "The underlying operating framework for the entire Xoeris hardware ecosystem." }
  ];

  return (
    <FamilyLayout
      title="Aetheris"
      tagline="Neural & Data Systems"
      description="The intelligent backbone of the ecosystem. Managing data, processing thought, and synchronizing global storage nodes."
      color="#10B981"
      pngIcon="/xoeris_aetherislogo.png"
      onNavigate={onNavigate}
    >
      <ProductGrid products={products} onNavigate={onNavigate} color="#10B981" />
    </FamilyLayout>
  );
}
