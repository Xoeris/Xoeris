import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, MonitorPlay, Globe, Cpu, Server, Sparkles, Hexagon, Terminal, Shield, Zap } from 'lucide-react';

// Futuristic CyberGlassMorphism Yellow Tech Palette
const colors = {
  bg: '#050505',
  primary: '#FDD935', // Neon Cyber Yellow
  secondary: '#F59E0B', // Amber
  accent: '#FEF08A', // Light Yellow Glow
  text: '#ffffff',
  textMuted: '#a1a1aa',
  glassBg: 'rgba(253, 217, 53, 0.03)',
  glassBorder: 'rgba(253, 217, 53, 0.2)'
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-[#FDD935] selection:text-black relative z-0 overflow-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-[-2] bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 mask-image-radial-gradient"></div>

      {/* Shared Animated Background Blobs (Yellow Tech Theme) */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen">
        <div className="blob blob-1" style={{ backgroundColor: colors.primary }}></div>
        <div className="blob blob-2" style={{ backgroundColor: colors.secondary }}></div>
        <div className="blob blob-3" style={{ backgroundColor: colors.accent }}></div>
        {/* Heavy Glass overlay for CyberGlassMorphism */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[100px]"></div>
      </div>

      <div className="animate-fade-in relative z-10">
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 shadow-[0_10px_30px_rgba(253,217,53,0.05)] backdrop-blur-2xl bg-black/50 border-b border-[#FDD935]/20' : 'py-6 bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#FDD935]/10 border border-[#FDD935]/40 flex items-center justify-center shadow-[0_0_15px_rgba(253,217,53,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(253,217,53,0.6)] backdrop-blur-md">
                <Server size={20} className="text-[#FDD935]" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-[#FDD935] group-hover:to-white transition-all">
                ACELBYTE
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#platform" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all uppercase tracking-wider">Platform</a>
              <a href="#solutions" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all uppercase tracking-wider">Solutions</a>
              <a href="#developers" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all uppercase tracking-wider">Developers</a>
              
              <div className="w-px h-6 bg-[#FDD935]/20"></div>

              <div className="flex items-center gap-5">
                <a href="#looma" className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  <Sparkles size={14} /> LOOMA
                </a>
                <a href="#xoeris" className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  <Hexagon size={14} /> XOERIS
                </a>
              </div>
              <a href="#contact" className="px-6 py-2.5 text-sm font-black uppercase tracking-wider rounded-lg transition-all hover:scale-105 shadow-[0_0_15px_rgba(253,217,53,0.4)] hover:shadow-[0_0_30px_rgba(253,217,53,0.7)]" style={{ backgroundColor: colors.primary, color: '#000' }}>
                Init Sequence
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-[#FDD935]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-[#FDD935]/20 shadow-[0_20px_40px_rgba(253,217,53,0.1)] py-6 flex flex-col items-center gap-6">
              <a href="#platform" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Platform</a>
              <a href="#solutions" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
              <a href="#developers" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Developers</a>
              <div className="w-1/2 h-px bg-[#FDD935]/20 my-2"></div>
              <a href="#looma" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-400 hover:text-white py-2 flex items-center gap-2">
                <Sparkles size={16} /> GO TO LOOMA
              </a>
              <a href="#xoeris" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-400 hover:text-white py-2 flex items-center gap-2">
                <Hexagon size={16} /> GO TO XOERIS
              </a>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <div className="z-10 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-xs font-bold uppercase tracking-widest mb-8 text-[#FDD935] shadow-[0_0_20px_rgba(253,217,53,0.15)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-pulse"></span>
                Acelbyte OS v2.0 Online
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[1.05] mb-6 tracking-tighter drop-shadow-2xl">
                CYBER <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#F59E0B] drop-shadow-[0_0_20px_rgba(253,217,53,0.5)]">
                  INFRA.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed font-medium">
                The ultimate backend architecture. We provide the high-velocity, glass-tier infrastructure required to power your next-generation digital ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <a href="#platform" className="flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-black transition-all hover:-translate-y-1 rounded-lg shadow-[0_0_20px_rgba(253,217,53,0.4)] hover:shadow-[0_0_40px_rgba(253,217,53,0.7)]" style={{ backgroundColor: colors.primary, color: '#000' }}>
                  Deploy Now <Zap size={18} />
                </a>
                <a href="#docs" className="flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-bold border border-[#FDD935]/30 transition-all hover:bg-[#FDD935]/10 hover:border-[#FDD935] rounded-lg bg-[#FDD935]/5 backdrop-blur-md text-[#FDD935]">
                  <Terminal size={18} /> Read Docs
                </a>
              </div>
            </div>

            {/* Hero Visual - Futuristic Cyber Motif */}
            <div className="relative flex justify-center lg:justify-end items-center h-96 lg:h-full z-0 perspective-1000">
              <div className="relative w-full max-w-md transform rotate-[-10deg] hover:rotate-[-5deg] transition-transform duration-1000 ease-out group flex justify-center">
                
                {/* Tech blocks representing glowing server blades */}
                <div className="relative w-64 h-96 flex flex-col items-center justify-center gap-6">
                  
                  {/* Blade 1 */}
                  <div className="w-64 h-24 rounded-2xl bg-[#FDD935]/5 backdrop-blur-2xl border border-[#FDD935]/30 shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_30px_rgba(253,217,53,0.1)] transition-all duration-700 group-hover:-translate-y-6 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_50px_rgba(253,217,53,0.3)] flex items-center px-6 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#FDD935] shadow-[0_0_15px_#FDD935]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FDD935]/10 to-transparent"></div>
                    <div className="w-full pl-4 flex flex-col gap-2 relative z-10">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#FDD935]">Node Alpha</span>
                        <div className="w-2 h-2 rounded-full bg-[#FDD935] shadow-[0_0_8px_#FDD935] animate-pulse"></div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#FDD935] w-[85%] shadow-[0_0_10px_#FDD935]"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Blade 2 */}
                  <div className="w-72 h-24 rounded-2xl bg-[#FDD935]/10 backdrop-blur-3xl border border-[#FDD935]/50 shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_40px_rgba(253,217,53,0.2)] transition-all duration-700 group-hover:scale-105 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_60px_rgba(253,217,53,0.4)] flex items-center px-6 z-10 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#F59E0B] shadow-[0_0_15px_#F59E0B]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/20 to-transparent"></div>
                    <div className="w-full pl-4 flex flex-col gap-2 relative z-10">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#F59E0B]">Core Proxy</span>
                        <div className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B] animate-pulse delay-75"></div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#F59E0B] w-[60%] shadow-[0_0_10px_#F59E0B]"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Blade 3 */}
                  <div className="w-64 h-24 rounded-2xl bg-[#FDD935]/5 backdrop-blur-2xl border border-[#FDD935]/30 shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_30px_rgba(253,217,53,0.1)] transition-all duration-700 group-hover:translate-y-6 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_50px_rgba(253,217,53,0.3)] flex items-center px-6 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#FEF08A] shadow-[0_0_15px_#FEF08A]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FEF08A]/10 to-transparent"></div>
                    <div className="w-full pl-4 flex flex-col gap-2 relative z-10">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#FEF08A]">Edge Relay</span>
                        <div className="w-2 h-2 rounded-full bg-[#FEF08A] shadow-[0_0_8px_#FEF08A] animate-pulse delay-150"></div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#FEF08A] w-[95%] shadow-[0_0_10px_#FEF08A]"></div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Decorative floating cyber elements */}
                <div className="absolute -top-12 -right-12 w-32 h-32 border border-[#FDD935]/30 rounded-full animate-spin-slow opacity-60 flex items-center justify-center shadow-[inset_0_0_20px_rgba(253,217,53,0.2)]" style={{ animationDuration: '20s' }}>
                   <div className="w-24 h-24 border border-dashed border-[#FDD935]/40 rounded-full animate-spin-reverse-slow"></div>
                </div>
                <div className="absolute -bottom-16 -left-16 w-40 h-40 border border-[#F59E0B]/20 backdrop-blur-md rounded-2xl animate-pulse delay-150 opacity-40 transform rotate-45 shadow-[0_0_30px_rgba(245,158,11,0.2)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section id="platform" className="py-24 px-6 md:px-12 relative border-t border-[#FDD935]/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center md:text-left md:w-2/3">
              <h2 className="text-sm font-black text-[#FDD935] uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_8px_rgba(253,217,53,0.8)]">System Specs</h2>
              <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">BUILT FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">HYPERSCALE.</span></h3>
              <p className="text-xl text-gray-400">A unified backend ecosystem empowering developers to focus on creating rather than maintaining glass-tier infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#FDD935]/40 hover:shadow-[0_0_40px_rgba(253,217,53,0.15)] transition-all duration-500 relative overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDD935] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#FDD935]/10 border border-[#FDD935]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(253,217,53,0.2)]">
                  <Globe size={32} className="text-[#FDD935] drop-shadow-[0_0_10px_rgba(253,217,53,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Global Network</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  Deploy your applications globally with zero latency. Our distributed edge network ensures your data is exactly where your users are.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:gap-4 transition-all text-[#FDD935]">
                  Init Protocol <ArrowRight size={16} />
                </a>
              </div>

              {/* Feature 2 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#F59E0B]/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-500 relative overflow-hidden rounded-3xl md:-translate-y-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]">
                  <Cpu size={32} className="text-[#F59E0B] drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Elastic Compute</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  Auto-scaling containers and serverless functions that automatically adjust to traffic spikes, ensuring flawless performance.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:gap-4 transition-all text-[#F59E0B]">
                  Scale Systems <ArrowRight size={16} />
                </a>
              </div>

              {/* Feature 3 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#FEF08A]/40 hover:shadow-[0_0_40px_rgba(254,240,138,0.15)] transition-all duration-500 relative overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FEF08A] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-200"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#FEF08A]/10 border border-[#FEF08A]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(254,240,138,0.2)]">
                  <Shield size={32} className="text-[#FEF08A] drop-shadow-[0_0_10px_rgba(254,240,138,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Zero-Trust Security</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  Military-grade encryption at rest and in transit. Protect your ecosystem with identity-aware proxies and automated threat mitigation.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:gap-4 transition-all text-[#FEF08A]">
                  Verify Security <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/80 backdrop-blur-3xl pt-20 pb-10 border-t border-[#FDD935]/20 mt-10 relative overflow-hidden">
          {/* Footer Cyber Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-[#FDD935] opacity-5 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-16 mb-16 relative z-10">
            <div className="md:col-span-2">
              <a href="#" className="flex items-center gap-3 mb-6 group inline-flex">
                <div className="w-10 h-10 rounded-xl bg-[#FDD935]/10 border border-[#FDD935]/40 flex items-center justify-center shadow-[0_0_15px_rgba(253,217,53,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(253,217,53,0.6)] backdrop-blur-md">
                  <Server size={20} className="text-[#FDD935]" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">ACELBYTE</span>
              </a>
              <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
                The premier backend infrastructure for multiplayer games and high-concurrency web applications.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Platform</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="#" className="hover:text-[#FDD935] hover:drop-shadow-[0_0_5px_rgba(253,217,53,0.5)] transition-all">Documentation</a></li>
                <li><a href="#" className="hover:text-[#FDD935] hover:drop-shadow-[0_0_5px_rgba(253,217,53,0.5)] transition-all">API Reference</a></li>
                <li><a href="#" className="hover:text-[#FDD935] hover:drop-shadow-[0_0_5px_rgba(253,217,53,0.5)] transition-all">System Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Ecosystem</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="#looma" className="hover:text-white transition-colors flex items-center gap-2 group"><Sparkles size={14} className="text-gray-500 group-hover:text-white transition-colors"/> Looma Studio</a></li>
                <li><a href="#xoeris" className="hover:text-white transition-colors flex items-center gap-2 group"><Hexagon size={14} className="text-gray-500 group-hover:text-white transition-colors"/> Xoeris Data</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm font-medium relative z-10">
            <p>&copy; {new Date().getFullYear()} Acelbyte Systems. <span className="text-[#FDD935]">All nodes operational.</span></p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#FDD935] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#FDD935] transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Animations */}
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
          opacity: 0.4;
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