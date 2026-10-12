import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ArrowRight, Globe, Cpu, Terminal, Shield, Zap,
  Layers, ExternalLink, Activity, Database, CheckCircle2,
  Sparkles, Code2, Server, Sliders, ChevronRight
} from 'lucide-react';
import FadeIn from './components/FadeIn';

// CyberGlassMorphism Yellow Tech Palette matching /about/acelbyte
const colors = {
  bg: '#050505',
  primary: '#FDD935', // Neon Cyber Yellow
  secondary: '#FFC94A', // Amber
  accent: '#FEF08A', // Light Yellow Glow
  text: '#ffffff',
  textMuted: '#a1a1aa',
  glassBg: 'rgba(253, 217, 53, 0.03)',
  glassBorder: 'rgba(253, 217, 53, 0.2)'
};

const PlatformCard = React.memo(({ platform, onClick }) => {
  return (
    <div
      onClick={() => onClick(platform)}
      className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-black cursor-pointer hover:border-[#FDD935]/50 hover:shadow-[0_0_30px_rgba(253,217,53,0.15)] transition-all duration-[400ms] ease-hyper hover:scale-[1.02] active:scale-[0.98] gpu-accel flex flex-col justify-end"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>

      {platform.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
          style={{ backgroundImage: `url('${platform.image}')`, backgroundSize: platform.imageContain ? 'contain' : 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
        ></div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#121212] to-black flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-[#FDD935]/5 border border-[#FDD935]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            {platform.icon && <platform.icon size={44} style={{ color: platform.color || '#FDD935' }} />}
          </div>
        </div>
      )}

      {/* Category Pill */}
      <div
        className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{ color: platform.color || colors.primary }}
      >
        {platform.category}
      </div>

      {/* Card Body */}
      <div className="relative z-20 p-8 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 will-change-transform">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color || colors.primary }}></div>
          <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">{platform.nodeId}</span>
        </div>
        <h4 className="text-2xl font-black mb-2 text-white group-hover:text-[#FDD935] transition-colors">{platform.title}</h4>
        <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
          {platform.description}
        </p>
      </div>
    </div>
  );
});

export default function XoerisPage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [activeTelemetryNode, setActiveTelemetryNode] = useState('xime');
  const [terminalLogIndex, setTerminalLogIndex] = useState(4);

  // Status blades adapted from Acelbyte for Xoeris nodes
  const statusBlades = [
    {
      id: 'xime',
      label: 'XIME Core Kernel',
      status: 'ONLINE • 99.9%',
      color: '#FDD935',
      width: 'w-64',
      animation: 'group-hover:-translate-y-6',
      shadowColor: '253,217,53',
      barWidth: '94%',
      metric: '0.64ms sync',
      desc: 'Modular OS kernel coordinating system services and low-latency IPC.'
    },
    {
      id: 'aurevia',
      label: 'Aurevia Neural Node',
      status: 'EDGE ROUTED',
      color: '#FFC94A',
      width: 'w-72',
      animation: 'group-hover:scale-105',
      shadowColor: '245,158,11',
      barWidth: '78%',
      metric: '14.2k req/s',
      desc: 'Distributed semantic indexing and real-time knowledge retrieval.'
    },
    {
      id: 'mesh',
      label: 'Planetary Mesh Fabric',
      status: 'SYNCHRONIZED',
      color: '#FEF08A',
      width: 'w-64',
      animation: 'group-hover:translate-y-6',
      shadowColor: '254,240,138',
      barWidth: '99%',
      metric: '140 nodes active',
      desc: 'Zero-trust peer-to-peer data plane with cryptographic verification.'
    }
  ];

  const platforms = [
    {
      id: 1,
      nodeId: 'NODE.OS-01',
      title: 'XIME Modular OS',
      category: 'Operating System',
      description: 'Xoeris Interactive Modular Ecosystem (XIME) provides a unified microkernel foundation for system services, user interfaces, media runtimes, and distributed applications.',
      image: '/xime_logo_text.png',
      imageContain: true,
      color: '#FDD935',
      stack: ['Rust', 'Microkernel', 'C++', 'Modular IPC', 'POSIX API'],
      targetRoute: 'xoeris',
      highlights: 'Dynamic hot-reloading of system components without reboot or service degradation.'
    },
    {
      id: 2,
      nodeId: 'NODE.3D-02',
      title: 'Horizone 3D Engine',
      category: 'Real-Time Graphics',
      description: 'High-velocity 3D simulation and world-building engine tailored for interactive animation, real-time rendering pipelines, and simulation environments.',
      image: '/xoeris_voltrix_horizone_logo_colored.png',
      imageContain: true,
      color: '#FFC94A',
      stack: ['Vulkan', 'WebGPU', 'Real-Time Shaders', 'Volumetric Lighting'],
      targetRoute: 'xoeris',
      highlights: 'Photorealistic particle kinematics and ultra-low frame-time delivery.'
    },
    {
      id: 3,
      nodeId: 'NODE.AI-03',
      title: 'Aurevia Search & Retrieval',
      category: 'Neural Search',
      description: 'Distributed knowledge retrieval and neural semantic search engine designed to index structured data and live web sources with sub-millisecond precision.',
      color: '#FEF08A',
      icon: Sparkles,
      stack: ['Vector DB', 'Neural Embeddings', 'Hybrid Search', 'FastAPI'],
      targetRoute: 'aurevia',
      highlights: 'High-concurrency query execution with continuous semantic index updates.'
    },
    {
      id: 4,
      nodeId: 'NODE.COG-04',
      title: 'XESC Cognitive Framework',
      category: 'Cognitive Architecture',
      description: 'Autonomous neural computing framework and high-level reasoning architecture engineered for adaptive system agents and deep intelligence workloads.',
      image: '/xesc_icon.png',
      imageContain: true,
      color: '#FDD935',
      stack: ['PyTorch', 'ONNX', 'Cognitive Agents', 'Edge Inference'],
      targetRoute: 'xoeris',
      highlights: 'Fault-tolerant cognitive execution nodes with localized self-healing state.'
    },
    {
      id: 5,
      nodeId: 'NODE.DSP-05',
      title: 'Xoeris Vocalis & Core-A',
      category: 'Audio Architecture',
      description: 'High-fidelity audio synthesis, real-time digital signal processing, and low-latency acoustic models built for studio production and spatial playback.',
      color: '#FFC94A',
      icon: Activity,
      stack: ['DSP', 'ASIO', 'Neural Vocoders', 'Spatial Audio'],
      targetRoute: 'ariasphere-vocalis',
      highlights: 'Ultra-low latency buffer sizes supporting live studio monitoring.'
    },
    {
      id: 6,
      nodeId: 'NODE.APEX-06',
      title: 'Apex Pro Workstation Suite',
      category: 'Professional Tools',
      description: 'High-performance creative engineering utilities, specialized CLI toolsets, and modular pipeline plugins built for demanding media production workflows.',
      image: '/xoeris_apex_logo_colored.png',
      imageContain: true,
      color: '#FEF08A',
      icon: Sliders,
      stack: ['Native C++', 'Real-Time Pipeline', 'CLI Tools', 'Workspace Sync'],
      targetRoute: 'subscriptions',
      highlights: 'Direct kernel-accelerated workstation tools for studio media engineering.'
    }
  ];

  const terminalLogs = [
    { time: '14:22:01.104', type: 'SYS', msg: 'XIME microkernel v2.6.4 initialized on physical host' },
    { time: '14:22:01.218', type: 'NET', msg: 'Connected to planetary mesh: 140 edge nodes verified' },
    { time: '14:22:01.392', type: 'AUTH', msg: 'Zero-trust cryptographic handshake established' },
    { time: '14:22:01.550', type: 'MEM', msg: 'Hardware-enforced memory isolation active (Ring-0/Ring-3)' },
    { time: '14:22:01.710', type: 'IPC', msg: 'Sub-millisecond IPC bus operational (latency: 0.64ms)' },
    { time: '14:22:01.890', type: 'OK', msg: 'All system clusters nominal. Ready for payload execution.' }
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeBladeData = statusBlades.find(b => b.id === activeTelemetryNode) || statusBlades[0];

  return (
    <div className="min-h-screen font-sans selection:bg-[#FDD935] selection:text-black relative z-0 overflow-x-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>

      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-[-2] bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 mask-image-radial-gradient"></div>

      {/* Shared Animated Background Blobs (Yellow Tech Theme) */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen gpu-accel">
        <div className="blob blob-1 will-change-transform" style={{ backgroundColor: colors.primary }}></div>
        <div className="blob blob-2 will-change-transform" style={{ backgroundColor: colors.secondary }}></div>
        <div className="blob blob-3 will-change-transform" style={{ backgroundColor: colors.accent }}></div>
        {/* Heavy Glass overlay for CyberGlassMorphism */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[60px]"></div>
      </div>

      <div className="animate-fade-in relative z-10">
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-300 gpu-accel ${isScrolled ? 'py-4 shadow-lg backdrop-blur-xl bg-black/50 border-b border-[#FDD935]/20' : 'py-6 bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
            <button onClick={() => onNavigate('xoeris')} className="flex items-center group bg-transparent border-none p-0 cursor-pointer">
              <div className="h-10 w-40 transition-transform duration-300 group-hover:scale-105">
                <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="w-full h-full object-contain object-left" />
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#platforms" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all duration-300 ease-hyper uppercase tracking-wider active:scale-95">Platforms</a>
              <a href="#architecture" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all duration-300 ease-hyper uppercase tracking-wider active:scale-95">Architecture</a>
              <a href="#telemetry" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all duration-300 ease-hyper uppercase tracking-wider active:scale-95">Telemetry</a>
              <button onClick={() => onNavigate('subscriptions')} className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all duration-300 ease-hyper uppercase tracking-wider bg-transparent border-none p-0 cursor-pointer">Pricing</button>
              <button onClick={() => onNavigate('about')} className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all duration-300 ease-hyper uppercase tracking-wider bg-transparent border-none p-0 cursor-pointer">About</button>

              <div className="w-px h-6 bg-[#FDD935]/20"></div>

              <button
                onClick={() => onNavigate('subscriptions')}
                className="px-6 py-2.5 text-sm font-black uppercase tracking-wider rounded-lg transition-all duration-500 ease-hyper hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(253,217,53,0.4)] hover:shadow-[0_0_30px_rgba(253,217,53,0.7)] cursor-pointer"
                style={{ backgroundColor: colors.primary, color: '#000' }}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-[#FDD935] transition-transform duration-300 ease-hyper active:scale-90 bg-transparent border-none p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-[#FDD935]/20 shadow-[0_20px_40px_rgba(253,217,53,0.1)] py-6 flex flex-col items-center gap-6 text-white">
              <a href="#platforms" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Platforms</a>
              <a href="#architecture" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
              <a href="#telemetry" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Telemetry</a>
              <button onClick={() => { onNavigate('subscriptions'); setMobileMenuOpen(false); }} className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest bg-transparent border-none">Pricing</button>
              <button onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }} className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest bg-transparent border-none">About</button>
              <div className="w-1/2 h-px bg-[#FDD935]/20 my-2"></div>
              <button
                onClick={() => { onNavigate('subscriptions'); setMobileMenuOpen(false); }}
                className="px-8 py-3 text-sm font-black uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(253,217,53,0.4)]"
                style={{ backgroundColor: colors.primary, color: '#000' }}
              >
                Get Started
              </button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <div className="z-10 relative text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-xs font-bold uppercase tracking-widest mb-8 text-[#FDD935] shadow-[0_0_20px_rgba(253,217,53,0.15)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-pulse"></span>
                Powered by XESC
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[1.05] mb-6 tracking-tighter drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#FFC94A] drop-shadow-[0_0_20px_rgba(253,217,53,0.5)]">
                  XOERIS
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed font-medium">
                Pioneering high-velocity software ecosystems, modular operating system architectures, and interactive digital environments.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <a
                  href="#platforms"
                  className="flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-black transition-all duration-500 ease-hyper hover:-translate-y-1 active:scale-95 rounded-lg shadow-[0_0_20px_rgba(253,217,53,0.4)] hover:shadow-[0_0_40px_rgba(253,217,53,0.7)] cursor-pointer"
                  style={{ backgroundColor: colors.primary, color: '#000' }}
                >
                  Explore Platforms <Zap size={18} />
                </a>
                <a
                  href="#architecture"
                  className="flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-bold border border-[#FDD935]/30 transition-all duration-500 ease-hyper hover:bg-[#FDD935]/10 hover:border-[#FDD935] active:scale-95 rounded-lg bg-[#FDD935]/5 backdrop-blur-md text-[#FDD935] cursor-pointer"
                >
                  <Cpu size={18} /> System Architecture
                </a>
              </div>
            </div>

            {/* Hero Visual - Cyber Motif & Glowing Server Blades */}
            <div className="relative flex justify-center lg:justify-end items-center h-96 lg:h-full z-0 perspective-1000">
              <div className="relative w-full max-w-md transform rotate-[-8deg] hover:rotate-[-3deg] transition-transform duration-1000 ease-out group flex justify-center">

                {/* Tech blocks representing glowing system blades */}
                <div className="relative w-64 h-96 flex flex-col items-center justify-center gap-6">
                  {statusBlades.map((blade) => {
                    const isSelected = activeTelemetryNode === blade.id;
                    return (
                      <div
                        key={blade.id}
                        className={`${blade.width} h-24 rounded-2xl backdrop-blur-2xl border transition-all duration-[600ms] ease-hyper ${blade.animation} flex items-center px-6 relative overflow-hidden group/blade cursor-pointer ${isSelected ? 'ring-2 ring-[#FDD935]/80 scale-[1.03]' : ''}`}
                        style={{
                          backgroundColor: `${blade.color}0D`,
                          borderColor: `${blade.color}4D`,
                          boxShadow: `0 15px 30px rgba(0,0,0,0.5), 0 0 30px rgba(${blade.shadowColor}, 0.15)`
                        }}
                        onClick={() => setActiveTelemetryNode(blade.id)}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-2 shadow-[0_0_15px]" style={{ backgroundColor: blade.color }}></div>
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${blade.color}1A, transparent)` }}></div>

                        <div className="w-full pl-4 flex flex-col gap-2 relative z-10">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[10px] uppercase font-black tracking-widest" style={{ color: blade.color }}>{blade.label}</span>
                            <div className="w-2 h-2 rounded-full shadow-[0_0_8px] animate-pulse" style={{ backgroundColor: blade.color }}></div>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full shadow-[0_0_10px] transition-all duration-300"
                              style={{ backgroundColor: blade.color, width: blade.barWidth }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                            <span>{blade.status}</span>
                            <span style={{ color: blade.color }}>{blade.metric}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Decorative floating cyber rings */}
                <div className="absolute -top-12 -right-12 w-32 h-32 border border-[#FDD935]/30 rounded-full animate-spin-slow opacity-60 flex items-center justify-center shadow-[inset_0_0_20px_rgba(253,217,53,0.2)]" style={{ animationDuration: '20s' }}>
                  <div className="w-24 h-24 border border-dashed border-[#FDD935]/40 rounded-full animate-spin-reverse-slow"></div>
                </div>
                <div className="absolute -bottom-16 -left-16 w-40 h-40 border border-[#FFC94A]/20 backdrop-blur-md rounded-2xl animate-pulse delay-150 opacity-40 transform rotate-45 shadow-[0_0_30px_rgba(245,158,11,0.2)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Metrics Telemetry Bar */}
        <section id="telemetry" className="py-12 border-y border-[#FDD935]/15 bg-black/60 backdrop-blur-xl relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-4 border-r border-[#FDD935]/10 last:border-none">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 mb-2">99.99%</div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#FDD935]">Service Availability</div>
            </div>
            <div className="p-4 border-r border-[#FDD935]/10 last:border-none">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#FFC94A] mb-2">&lt; 0.8ms</div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#FFC94A]">Planetary IPC Latency</div>
            </div>
            <div className="p-4 border-r border-[#FDD935]/10 last:border-none">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 mb-2">140+</div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#FEF08A]">Synchronized Nodes</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#FFC94A] mb-2">0-Trust</div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#FDD935]">Cryptographic Isolation</div>
            </div>
          </div>
        </section>

        {/* Core Architecture Pillars */}
        <section id="architecture" className="py-24 px-6 md:px-12 relative text-white">
          <FadeIn className="max-w-7xl mx-auto">
            <div className="mb-20 text-center md:text-left md:w-2/3">
              <h2 className="text-sm font-black text-[#FDD935] uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_8px_rgba(253,217,53,0.8)]">System Architecture</h2>
              <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">MODULAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">ENGINEERING.</span></h3>
              <p className="text-xl text-gray-400">Decoupled operating components built on fault-tolerant runtimes, real-time pipelines, and microkernel abstractions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#FDD935]/40 hover:shadow-[0_0_40px_rgba(253,217,53,0.15)] transition-all duration-[400ms] ease-hyper hover:-translate-y-2 relative overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDD935] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#FDD935]/10 border border-[#FDD935]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(253,217,53,0.2)]">
                  <Cpu size={32} className="text-[#FDD935] drop-shadow-[0_0_10px_rgba(253,217,53,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Decoupled Microkernel</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  XIME decouples system services, audio pipelines, and UI shells into isolated components. Update, replace, or hot-reload nodes without rebooting the OS.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#FDD935]">
                  Microkernel Core <ArrowRight size={16} />
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#FFC94A]/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-[400ms] ease-hyper hover:-translate-y-2 relative overflow-hidden rounded-3xl md:-translate-y-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFC94A] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#FFC94A]/10 border border-[#FFC94A]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]">
                  <Globe size={32} className="text-[#FFC94A] drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Distributed Mesh</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  Planetary-scale peer mesh synchronizing compute nodes, edge assets, and live user state across distributed hardware with cryptographic safety.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#FFC94A]">
                  Edge Fabric <ArrowRight size={16} />
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#FEF08A]/40 hover:shadow-[0_0_40px_rgba(254,240,138,0.15)] transition-all duration-[400ms] ease-hyper hover:-translate-y-2 relative overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FEF08A] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-200"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#FEF08A]/10 border border-[#FEF08A]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(254,240,138,0.2)]">
                  <Shield size={32} className="text-[#FEF08A] drop-shadow-[0_0_10px_rgba(254,240,138,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Zero-Trust Boundaries</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  Hardware-enforced memory isolation, ephemeral cryptographic keys, and automated anomaly containment keeping application runtime environments pristine.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#FEF08A]">
                  Hardened Security <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Ecosystem Platforms Showcase */}
        <section id="platforms" className="py-24 px-6 md:px-12 relative text-white border-t border-[#FDD935]/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-sm font-black text-[#FDD935] uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_8px_rgba(253,217,53,0.8)]">Core Portfolio</h2>
                <h3 className="text-4xl md:text-6xl font-black tracking-tight">ECOSYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">PLATFORMS.</span></h3>
              </div>
              <a
                href="#architecture"
                className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#FDD935] transition-colors duration-300 ease-hyper"
              >
                View Architecture Nodes <ArrowRight size={16} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  onClick={(p) => setSelectedPlatform(p)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Live Interactive Node Terminal & Console Preview */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <FadeIn>
            <div className="bg-[#0a0a0a] border border-[#FDD935]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(253,217,53,0.1)]">
              {/* Terminal Title Bar */}
              <div className="px-6 py-4 bg-black/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="text-xs font-mono text-gray-400 ml-4">xoeris@xime-node-cluster-01:~$</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#FDD935]">
                  <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-pulse"></span>
                  LIVE TELEMETRY STREAM
                </div>
              </div>

              {/* Terminal Logs Content */}
              <div className="p-8 font-mono text-sm space-y-3 bg-black/60 min-h-[220px]">
                {terminalLogs.slice(0, terminalLogIndex + 1).map((log, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-300">
                    <span className="text-gray-500 text-xs">{log.time}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase w-fit bg-[#FDD935]/10 text-[#FDD935] border border-[#FDD935]/20">{log.type}</span>
                    <span className="text-gray-300">{log.msg}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-[#FDD935] pt-2">
                  <span>&gt;</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>

              {/* Terminal Footer CTA */}
              <div className="p-6 bg-black/90 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-gray-400">
                  <strong className="text-white">Active Node Selected:</strong> {activeBladeData.label} — {activeBladeData.desc}
                </div>
                <div className="flex gap-4">
                  <a
                    href="#platforms"
                    className="px-5 py-2.5 bg-[#FDD935] text-black font-black uppercase text-xs tracking-wider rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center"
                  >
                    Explore Platforms
                  </a>
                  <button
                    onClick={() => onNavigate('subscriptions')}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-white font-bold uppercase text-xs tracking-wider rounded-lg hover:border-[#FDD935]/50 transition-all cursor-pointer"
                  >
                    View Pricing
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Selected Platform Detail Modal */}
        {selectedPlatform && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 text-white">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedPlatform(null)}></div>
            <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[#FDD935]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(253,217,53,0.15)] animate-fade-in max-h-[90vh] overflow-y-auto">

              {/* Close Button */}
              <button
                onClick={() => setSelectedPlatform(null)}
                className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#FDD935] hover:text-black transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto min-h-[360px] bg-black flex items-center justify-center p-8">
                  {selectedPlatform.image ? (
                    <img
                      src={selectedPlatform.image}
                      alt={selectedPlatform.title}
                      className="max-h-56 max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-3xl bg-[#FDD935]/10 border border-[#FDD935]/30 flex items-center justify-center">
                      {selectedPlatform.icon && <selectedPlatform.icon size={64} className="text-[#FDD935]" />}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r"></div>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/20 text-[#FDD935] text-xs font-black uppercase tracking-widest w-fit mb-6">
                    {selectedPlatform.category}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                    {selectedPlatform.title}
                  </h2>

                  <p className="text-gray-300 text-base leading-relaxed mb-6 font-medium">
                    {selectedPlatform.description}
                  </p>

                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
                    <span className="text-[#FDD935] font-black uppercase tracking-wider block mb-1">Architecture Highlight:</span>
                    {selectedPlatform.highlights}
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Core Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlatform.stack.map((tech, index) => (
                        <span key={index} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        const target = selectedPlatform.targetRoute;
                        setSelectedPlatform(null);
                        onNavigate(target);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FDD935] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#FFC94A] hover:scale-105 active:scale-95 transition-all duration-500 ease-hyper cursor-pointer"
                    >
                      Open Node <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedPlatform(null)}
                      className="inline-flex items-center justify-center px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unified Cyber Footer */}
        <footer className="bg-black/80 backdrop-blur-3xl pt-20 pb-10 border-t border-[#FDD935]/20 mt-10 relative overflow-hidden text-white">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-[#FDD935] opacity-5 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-16 mb-16 relative z-10">
            <div className="md:col-span-2">
              <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-3 mb-6 group inline-flex bg-transparent border-none p-0 cursor-pointer">
                <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="h-10 w-40 object-contain object-left transition-transform duration-300 group-hover:scale-105" />
              </button>
              <p className="text-gray-400 max-w-sm font-medium leading-relaxed mb-6">
                Pioneering professional software ecosystems, modular operating system frameworks, and interactive digital computing environments.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                All Planetary Nodes Operational
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Ecosystem</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="#platforms" className="hover:text-[#FDD935] transition-colors duration-300">XIME Modular OS</a></li>
                <li><a href="#architecture" className="hover:text-[#FDD935] transition-colors duration-300">Architecture Nodes</a></li>
                <li><button onClick={() => onNavigate('aurevia')} className="hover:text-[#FDD935] transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer text-left">Aurevia Search</button></li>
                <li><button onClick={() => onNavigate('subscriptions')} className="hover:text-[#FDD935] transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer text-left">Subscriptions</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Company</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><button onClick={() => onNavigate('about')} className="hover:text-[#FDD935] transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer text-left">About Firm</button></li>
                <li><button onClick={() => onNavigate('digital-artifacts')} className="hover:text-[#FDD935] transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer text-left">Digital Artifacts</button></li>
                <li><a href="#" className="hover:text-[#FDD935] transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#FDD935] transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#FDD935] transition-colors duration-300">Security & Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm font-medium relative z-10">
            <p>© 2020-2026 Xoeris. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-[#FDD935] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#FDD935] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#FDD935] transition-colors">EULA</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Cyber Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .mask-image-radial-gradient {
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 15s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blob1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30vw, 10vh) scale(1.1); }
          66% { transform: translate(-10vw, 20vh) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-20vw, -20vh) scale(1.2); }
          66% { transform: translate(20vw, -10vh) scale(0.8); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob3 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15vw, -30vh) scale(1.1); }
          66% { transform: translate(-15vw, -20vh) scale(1.3); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .blob {
          position: absolute;
          filter: blur(120px);
          opacity: 0.35;
          border-radius: 50%;
          animation-iteration-count: infinite;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-direction: alternate;
          mix-blend-mode: screen;
        }
        .blob-1 {
          width: 50vw;
          height: 50vw;
          top: -10%;
          left: -10%;
          animation-name: blob1;
          animation-duration: 20s;
        }
        .blob-2 {
          width: 45vw;
          height: 45vw;
          top: 40%;
          right: -10%;
          animation-name: blob2;
          animation-duration: 25s;
        }
        .blob-3 {
          width: 60vw;
          height: 60vw;
          bottom: -20%;
          left: 10%;
          animation-name: blob3;
          animation-duration: 22s;
        }
      `}} />
    </div>
  );
}
