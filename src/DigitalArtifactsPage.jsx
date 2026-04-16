import React, { useState, useEffect } from 'react';
import { ArrowLeft, Box, Code, Database, FileText, Layers, Terminal } from 'lucide-react';
import FadeIn from './components/FadeIn';

const artifacts = [
  {
    id: 1,
    title: "Project Nebula",
    type: "Source Code",
    date: "2023-11-15",
    description: "Experimental particle system written in Rust/WASM.",
    icon: <Code size={24} className="text-[#FDD935]" />
  },
  {
    id: 2,
    title: "Cyberpunk UI Kit",
    type: "Design System",
    date: "2023-09-22",
    description: "A comprehensive React component library for futuristic interfaces.",
    icon: <Layers size={24} className="text-[#F59E0B]" />
  },
  {
    id: 3,
    title: "Neural Network Viz",
    type: "Experiment",
    date: "2023-08-10",
    description: "3D visualization of neural network training process using Three.js.",
    icon: <Box size={24} className="text-[#FEF08A]" />
  },
  {
    id: 4,
    title: "Legacy Systems",
    type: "Archive",
    date: "2023-05-30",
    description: "Restored documentation from early 2000s web experiments.",
    icon: <FileText size={24} className="text-[#FDD935]" />
  },
  {
    id: 5,
    title: "Botnet Simulation",
    type: "Simulation",
    date: "2023-03-12",
    description: "Agent-based modeling of network propagation dynamics.",
    icon: <Terminal size={24} className="text-[#F59E0B]" />
  },
  {
    id: 6,
    title: "Data Shards",
    type: "Dataset",
    date: "2023-01-05",
    description: "Collection of glitched datasets for creative coding.",
    icon: <Database size={24} className="text-[#FEF08A]" />
  }
];

export default function DigitalArtifactsPage({ onNavigate }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FDD935] selection:text-black overflow-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-30"></div>
      
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FDD935] blur-[100px] opacity-[0.15] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#F59E0B] blur-[120px] opacity-[0.1] rounded-full animate-pulse delay-1000"></div>
      </div>

      <FadeIn className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24">
        {/* Header */}
        <header className="mb-20">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden border border-[#FDD935]/20 shadow-[0_0_20px_rgba(253,217,53,0.1)]">
              <img src="/acelbyte-logo.png" alt="Acelbyte Logo" className="w-full h-full object-cover" />
            </div>
            
            <button 
              onClick={() => onNavigate('acelbyte')}
              className="group flex items-center gap-2 text-gray-400 hover:text-[#FDD935] transition-colors duration-300 ease-hyper active:scale-95"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300 ease-hyper-bounce" />
              <span className="text-sm font-bold uppercase tracking-widest">Return to Base</span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[#FDD935]/20 pb-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#F59E0B]">ARTIFACTS</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl">
                A collection of experiments, source code, and digital remnants from the archives.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-[#FDD935] font-mono text-sm">SYS.STATUS: ONLINE</div>
              <div className="text-gray-500 font-mono text-xs mt-1">ARCHIVE.VER.2.4.0</div>
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifacts.map((artifact) => (
            <div 
              key={artifact.id}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#FDD935]/50 transition-all duration-300 cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredId(artifact.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Hover Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br from-[#FDD935]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-lg bg-black/50 border border-white/10 group-hover:border-[#FDD935] transition-colors">
                    {artifact.icon}
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-[#FDD935] transition-colors">
                    {artifact.date}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#FDD935] transition-colors">{artifact.title}</h3>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{artifact.type}</div>
                <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                  {artifact.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-bold text-gray-300 group-hover:text-white transition-colors mt-auto">
                  Access Data <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform duration-300 ease-hyper-bounce" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>END OF ARCHIVE • <span className="text-[#FDD935]">SECURE CONNECTION</span></p>
        </footer>
      </FadeIn>
    </div>
  );
}