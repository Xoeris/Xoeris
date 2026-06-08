import React from 'react';
import { FamilyLayout, ProductGrid } from './components/XoerisShared';
import { Zap, Smartphone, Thermometer } from 'lucide-react';

export default function VoltrixPage({ onNavigate }) {
  const products = [
    { id: 1, name: "SAMUDRA", route: "samudra", icon: Smartphone, desc: "Integrated maritime R&D system. Real-time telemetry, solar management, and fish tracking." },
    { id: 2, name: "Ion-X", route: "voltrix", icon: Zap, desc: "Solid-state energy storage research for long-term maritime and atmospheric missions." },
    { id: 3, name: "Cryo-V", route: "voltrix", icon: Thermometer, desc: "Thermal management systems designed for Zenith-class computational arrays." }
  ];

  return (
    <FamilyLayout
      title="Voltrix"
      tagline="Innovation & R&D"
      description="The experimental heart of Xoeris. Where fundamental physics meets hardware innovation to solve the challenges of tomorrow."
      color="#FDD935"
      pngIcon="/xoeris_voltrix_logo_icon_2026.png"
      onNavigate={onNavigate}
    >
      <ProductGrid products={products} onNavigate={onNavigate} color="#FDD935" />
    </FamilyLayout>
  );
}
