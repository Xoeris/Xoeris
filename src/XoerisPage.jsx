import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ArrowRight, Globe, Cpu, Shield, Zap,
  ChevronDown, ChevronUp, Download, ArrowUpRight
} from 'lucide-react';
import FadeIn from './components/FadeIn';
import { getStoredUser, getStoredToken, clearSession, syncUserFromDatabase } from './services/authService';

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

export default function XoerisPage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTelemetryNode, setActiveTelemetryNode] = useState('xime');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getStoredUser());
    };
    window.addEventListener('xoeris_auth_change', handleAuthChange);

    // Sync user data from database if session token is available
    if (getStoredToken()) {
      syncUserFromDatabase().then((synced) => {
        if (synced) setCurrentUser(synced);
      });
    }

    return () => window.removeEventListener('xoeris_auth_change', handleAuthChange);
  }, []);

  const handleMouseEnter = (dropdownKey) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (dropdownKey) {
      setActiveDropdown(dropdownKey);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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

      {/* Navigation - Liquid Glass Sticky Top */}
      <nav
        ref={navRef}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3.5' : 'py-5'}`}
      >
        {/* Isolated Liquid Glass Header Background */}
        <div
          className="absolute inset-0 pointer-events-none liquid-glass-panel border-b border-white/10"
          style={{ backdropFilter: 'blur(28px) saturate(190%)', WebkitBackdropFilter: 'blur(28px) saturate(190%)' }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative z-10">
            <button
              onClick={() => { window.location.href = 'https://xoeris.com'; }}
              onMouseEnter={() => handleMouseEnter(null)}
              className="flex items-center group bg-transparent border-none p-0 cursor-pointer"
            >
              <div className="h-10 w-40 transition-transform duration-300 group-hover:scale-105">
                <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="w-full h-full object-contain object-left" />
              </div>
            </button>

            {/* Desktop Nav Tabs matching Image 2 */}
            <div className="hidden lg:flex items-center gap-7" onMouseLeave={handleMouseLeave}>
              {/* Product Tab with Mega Menu */}
              <div
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter('product')}
              >
                <button
                  onClick={() => setActiveDropdown(prev => prev === 'product' ? null : 'product')}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer ${activeDropdown === 'product' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                >
                  <span>Product</span>
                  {activeDropdown === 'product' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {/* Mega Menu Dropdown: Product (matching Image 2) */}
                {activeDropdown === 'product' && (
                  <div
                    onMouseEnter={() => handleMouseEnter('product')}
                    onMouseLeave={handleMouseLeave}
                    className="hidden lg:block absolute top-full left-0 w-[540px] pt-2 z-50"
                  >
                    <div
                      className="relative liquid-glass-panel border border-white/20 rounded-3xl shadow-none p-8 text-left overflow-hidden ring-1 ring-white/10"
                      style={{ backdropFilter: 'blur(32px) saturate(190%)', WebkitBackdropFilter: 'blur(32px) saturate(190%)' }}
                    >
                      {/* Liquid Glass specular sheen */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></div>
                      <div className="absolute -top-12 left-1/3 w-72 h-28 bg-[#FDD935]/[0.08] rounded-full blur-3xl pointer-events-none"></div>

                      <div className="grid grid-cols-2 gap-8 relative z-10">
                        {/* Column 1: Products */}
                        <div className="border-r border-white/10 pr-6">
                          <div className="text-xs font-semibold text-gray-400 mb-3 tracking-wide">Product</div>
                          <ul className="space-y-2.5">
                            <li><button onClick={() => { setActiveDropdown(null); onNavigate('apex'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer text-left w-full">APEX</button></li>
                            <li><button onClick={() => { setActiveDropdown(null); onNavigate('horizoneengine'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer text-left w-full">Horizone Engine</button></li>
                            <li><button onClick={() => { setActiveDropdown(null); onNavigate('horizoneide'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer text-left w-full">Horizone IDE</button></li>
                            <li><button onClick={() => { setActiveDropdown(null); onNavigate('mova'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer text-left w-full">MOVA</button></li>
                            <li><button onClick={() => { setActiveDropdown(null); onNavigate('musify'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer text-left w-full">Musify</button></li>
                            <li><button onClick={() => { setActiveDropdown(null); onNavigate('xalme'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer text-left w-full">Xalme</button></li>
                            <li><button onClick={() => { setActiveDropdown(null); onNavigate('xalmecode'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer text-left w-full">Xalme Code</button></li>
                          </ul>
                        </div>

                        {/* Column 2: Models */}
                        <div>
                          <div className="text-xs font-semibold text-gray-400 mb-3 tracking-wide">Models</div>
                          <ul className="space-y-2.5">
                            <li>
                              <button onClick={() => { setActiveDropdown(null); onNavigate('chat'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors flex items-center justify-between group bg-transparent border-none p-0 cursor-pointer w-full text-left">
                                <span>Elarion</span>
                                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#FDD935] transition-colors" />
                              </button>
                            </li>
                            <li>
                              <button onClick={() => { setActiveDropdown(null); onNavigate('chat'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors flex items-center justify-between group bg-transparent border-none p-0 cursor-pointer w-full text-left">
                                <span>Nebula</span>
                                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#FDD935] transition-colors" />
                              </button>
                            </li>
                            <li>
                              <button onClick={() => { setActiveDropdown(null); onNavigate('chat'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors flex items-center justify-between group bg-transparent border-none p-0 cursor-pointer w-full text-left">
                                <span>Forge</span>
                                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#FDD935] transition-colors" />
                              </button>
                            </li>
                            <li>
                              <button onClick={() => { setActiveDropdown(null); onNavigate('chat'); }} className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors flex items-center justify-between group bg-transparent border-none p-0 cursor-pointer w-full text-left">
                                <span>Atlas</span>
                                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#FDD935] transition-colors" />
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Bottom Bar */}
                      <div className="border-t border-white/10 mt-8 pt-5 flex justify-between items-center text-xs relative z-10">
                        <button onClick={() => { setActiveDropdown(null); onNavigate('pricing'); }} className="font-semibold text-white underline hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer">
                          Import to Xoeris
                        </button>
                        <div className="flex items-center gap-3">
                          <button onClick={() => { setActiveDropdown(null); onNavigate('pricing'); }} className="px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-white font-medium flex items-center gap-1.5 transition-colors bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                            <span>Download apps</span>
                            <Download size={13} />
                          </button>
                          {currentUser ? (
                            <button onClick={() => { setActiveDropdown(null); onNavigate('chat'); }} className="px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-white font-medium flex items-center gap-1.5 transition-colors bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                              <span>{currentUser.name || currentUser.username}</span>
                            </button>
                          ) : (
                            <button onClick={() => { setActiveDropdown(null); onNavigate('auth'); }} className="px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-white font-medium flex items-center gap-1.5 transition-colors bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                              <span>Login</span>
                              <ArrowUpRight size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Tab */}
              <div
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter(null)}
              >
                <button
                  onClick={() => { setActiveDropdown(null); onNavigate('pricing'); }}
                  className="flex items-center text-sm font-semibold text-gray-300 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  <span>Pricing</span>
                </button>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-4" onMouseEnter={() => handleMouseEnter(null)}>
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-full border border-white/20 hover:border-[#FDD935]/80 transition-all bg-white/5 hover:bg-white/10 cursor-pointer group shadow-[0_0_15px_rgba(253,217,53,0.15)]"
                    title={currentUser.name || currentUser.username || currentUser.email}
                  >
                    {currentUser.avatar_url ? (
                      <img
                        src={currentUser.avatar_url}
                        alt={currentUser.name || currentUser.username || 'User avatar'}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#FDD935]/40"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FDD935] to-[#FFC94A] text-black font-black text-xs flex items-center justify-center ring-1 ring-white/30 uppercase">
                        {(currentUser.name || currentUser.username || currentUser.email || 'U')[0]}
                      </div>
                    )}
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl p-3 liquid-glass-panel border border-white/20 ring-1 ring-white/10 shadow-2xl z-50 animate-fade-in text-left"
                      style={{ backdropFilter: 'blur(32px) saturate(190%)', WebkitBackdropFilter: 'blur(32px) saturate(190%)' }}
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-2">
                        <p className="text-xs font-bold text-white truncate">{currentUser.name || currentUser.username || 'Xoeris Member'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => { setUserDropdownOpen(false); onNavigate('chat'); }}
                        className="w-full px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-left"
                      >
                        <span>Xalme Chat</span>
                      </button>
                      <button
                        onClick={() => { setUserDropdownOpen(false); onNavigate('pricing'); }}
                        className="w-full px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-left"
                      >
                        <span>Pricing & Plans</span>
                      </button>
                      <div className="h-px bg-white/10 my-1"></div>
                      <button
                        onClick={() => {
                          clearSession();
                          setUserDropdownOpen(false);
                          setCurrentUser(null);
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-left"
                      >
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('auth')}
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => onNavigate('chat')}
                className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
              >
                Try Xalme
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-[#FDD935] transition-transform duration-300 ease-hyper active:scale-90 bg-transparent border-none p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl py-6 px-6 flex flex-col gap-5 text-white max-h-[85vh] overflow-y-auto">
              {/* Product Section */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935]">Products</div>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {[
                    { label: 'APEX', route: 'apex' },
                    { label: 'Horizone Engine', route: 'horizoneengine' },
                    { label: 'Horizone IDE', route: 'horizoneide' },
                    { label: 'MOVA', route: 'mova' },
                    { label: 'Musify', route: 'musify' },
                    { label: 'Xalme', route: 'xalme' },
                    { label: 'Xalme Code', route: 'xalmecode' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { onNavigate(item.route); setMobileMenuOpen(false); }}
                      className="text-left text-sm font-semibold text-gray-300 hover:text-white bg-transparent border-none p-1 cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Section */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935]">Models</div>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {['Elarion', 'Nebula', 'Forge', 'Atlas'].map((model) => (
                    <button
                      key={model}
                      onClick={() => { onNavigate('chat'); setMobileMenuOpen(false); }}
                      className="text-left text-sm font-semibold text-gray-300 hover:text-white bg-transparent border-none p-1 cursor-pointer flex items-center justify-between"
                    >
                      <span>{model}</span>
                      <ArrowUpRight size={12} className="text-gray-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => { onNavigate('pricing'); setMobileMenuOpen(false); }}
                  className="text-left text-base font-semibold text-white hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer w-full flex items-center justify-between"
                >
                  <span>Pricing</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#FDD935]/15 text-[#FDD935] border border-[#FDD935]/30 uppercase font-black">Plans</span>
                </button>
              </div>

              <div className="w-full h-px bg-white/10 my-1"></div>

              {/* User Account / Auth */}
              {currentUser ? (
                <div className="flex items-center justify-between py-2 border-y border-white/10 my-1">
                  <div className="flex items-center gap-3">
                    {currentUser.avatar_url ? (
                      <img src={currentUser.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-[#FDD935]" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FDD935] text-black font-bold text-xs flex items-center justify-center">
                        {(currentUser.name || currentUser.username || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-xs font-bold text-white truncate max-w-[150px]">{currentUser.name || currentUser.username}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { clearSession(); setMobileMenuOpen(false); setCurrentUser(null); }}
                    className="text-xs text-red-400 hover:text-red-300 underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                  className="text-left text-base font-semibold text-gray-300 hover:text-white bg-transparent border-none p-0 cursor-pointer"
                >
                  Login
                </button>
              )}

              <button
                onClick={() => { onNavigate('chat'); setMobileMenuOpen(false); }}
                className="w-full py-3.5 text-sm font-black uppercase tracking-wider rounded-xl bg-[#FDD935] hover:bg-[#FFE066] text-black text-center shadow-[0_0_20px_rgba(253,217,53,0.3)] border-none cursor-pointer"
              >
                Try Xalme
              </button>
            </div>
          )}
        </nav>

        <div className="animate-fade-in relative z-10">
          {/* Hero Section */}
        <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <div className="z-10 relative text-white">
              <h1 className="text-6xl md:text-8xl font-black leading-[1.05] mb-6 tracking-tighter drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#FFC94A] drop-shadow-[0_0_20px_rgba(253,217,53,0.5)]">
                  XOERIS
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed font-medium">
                Pioneering high-velocity software ecosystems, modular operating system architectures, and interactive digital environments.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={() => onNavigate('pricing')}
                  className="flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-black transition-all duration-500 ease-hyper hover:-translate-y-1 active:scale-95 rounded-lg shadow-[0_0_20px_rgba(253,217,53,0.4)] hover:shadow-[0_0_40px_rgba(253,217,53,0.7)] cursor-pointer"
                  style={{ backgroundColor: colors.primary, color: '#000' }}
                >
                  Get Started <Zap size={18} />
                </button>
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

        {/* Unified Cyber Footer */}
        <footer className="bg-black/80 backdrop-blur-3xl pt-20 pb-10 border-t border-[#FDD935]/20 mt-10 relative overflow-hidden text-white">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-[#FDD935] opacity-5 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10">
            <div className="md:col-span-5">
              <button onClick={() => { window.location.href = 'https://xoeris.com'; }} className="flex items-center gap-3 mb-6 group inline-flex bg-transparent border-none p-0 cursor-pointer">
                <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="h-10 w-40 object-contain object-left transition-transform duration-300 group-hover:scale-105" />
              </button>
              <p className="text-gray-400 max-w-sm font-medium leading-relaxed mb-6">
                Pioneering professional software ecosystems, modular operating system frameworks, and interactive digital computing environments.
              </p>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Products</h4>
              <ul className="space-y-3 text-gray-400 font-medium text-sm">
                {[
                  { label: 'APEX', route: 'apex' },
                  { label: 'Horizone Engine', route: 'horizoneengine' },
                  { label: 'Horizone IDE', route: 'horizoneide' },
                  { label: 'MOVA', route: 'mova' },
                  { label: 'Musify', route: 'musify' },
                  { label: 'Xalme', route: 'xalme' },
                  { label: 'Xalme Code', route: 'xalmecode' }
                ].map((item) => (
                  <li key={item.label}>
                    <button onClick={() => onNavigate(item.route)} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Models</h4>
              <ul className="space-y-3 text-gray-400 font-medium text-sm">
                {['Elarion', 'Nebula', 'Forge', 'Atlas'].map((model) => (
                  <li key={model}>
                    <button onClick={() => onNavigate('chat')} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left flex items-center justify-between group w-full">
                      <span>{model}</span>
                      <ArrowUpRight size={12} className="text-gray-500 group-hover:text-[#FDD935] transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Pricing</h4>
              <ul className="space-y-3 text-gray-400 font-medium text-sm">
                <li>
                  <button onClick={() => onNavigate('pricing')} className="hover:text-[#FDD935] transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left">
                    Plans & Billing
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm font-medium relative z-10">
            <p>© 2020-2026 Xoeris. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-[#FDD935] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#FDD935] transition-colors">Terms</a>
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
