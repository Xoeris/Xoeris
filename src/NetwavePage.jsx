import React from 'react';
import { FamilyLayout, ProductGrid } from './components/XoerisShared';
import { Wifi, Radio, Zap } from 'lucide-react';

export default function NetwavePage({ onNavigate }) {
  const products = [
    { id: 1, name: "Node-S", route: "netwave", icon: Radio, desc: "Satellite-integrated connectivity nodes for global deep-sea and high-altitude coverage." },
    { id: 2, name: "Wave-Link", route: "netwave", icon: Wifi, desc: "Ultra-wideband data transmission protocols for multi-device synchronization." },
    { id: 3, name: "Core-Pulse", route: "netwave", icon: Zap, desc: "The backbone of the Xoeris internal network, ensuring <1ms latency across nodes." }
  ];

  return (
    <FamilyLayout
      title="Netwave"
      tagline="Global Connectivity"
      description="Breaking the barriers of communication. Establishing a high-speed, resilient networking layer for the next generation of interconnected systems."
      color="#3B82F6"
      onNavigate={onNavigate}
    >
      <ProductGrid products={products} onNavigate={onNavigate} color="#3B82F6" />
    </FamilyLayout>
  );
}
