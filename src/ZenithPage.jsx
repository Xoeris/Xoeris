import React from 'react';
import { FamilyLayout, ProductGrid } from './components/XoerisShared';
import { Cpu, Activity, Layout } from 'lucide-react';

export default function ZenithPage({ onNavigate }) {
  const products = [
    { id: 1, name: "Core-A", route: "zenith-corea", icon: Cpu, desc: "The foundational CPU architecture powering all XESC neural processing units." },
    { id: 2, name: "Nexus-G", route: "zenith", icon: Layout, desc: "High-density GPU clusters optimized for Horizone and real-time volumetric rendering." },
    { id: 3, name: "Phys-X", route: "zenith", icon: Activity, desc: "A unified physics engine that standardizes interactions across all Xoeris digital products." }
  ];

  return (
    <FamilyLayout
      title="Zenith"
      tagline="Computational Core"
      description="The primary engine of the ecosystem. Engineering the raw hardware and mathematical frameworks that make digital life possible."
      color="#EF4444"
      onNavigate={onNavigate}
    >
      <ProductGrid products={products} onNavigate={onNavigate} color="#EF4444" />
    </FamilyLayout>
  );
}
