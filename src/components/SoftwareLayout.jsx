import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { getStoredUser, clearSession } from '../services/authService';

export default function SoftwareLayout({
  title,
  subtitle,
  categoryTag = "Product",
  onNavigate,
  children
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const navRef = useRef(null);
  const timeoutRef = useRef(null);
  const userMenuTriggerRef = useRef(null);
  const userDropdownMenuRef = useRef(null);

  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(getStoredUser());
    window.addEventListener('xoeris_auth_change', handleAuthChange);
    return () => window.removeEventListener('xoeris_auth_change', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedTrigger = userMenuTriggerRef.current && userMenuTriggerRef.current.contains(event.target);
      const clickedMenu = userDropdownMenuRef.current && userDropdownMenuRef.current.contains(event.target);
      if (!clickedTrigger && !clickedMenu) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 40;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menuName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const productList = [
    { label: 'APEX', route: 'apex' },
    { label: 'Horizone Engine', route: 'under-construction' },
    { label: 'Horizone IDE', route: 'horizoneide' },
    { label: 'MOVA', route: 'mova' },
    { label: 'Musify', route: 'musify' },
    { label: 'Xalme', route: 'xalme' },
    { label: 'Xalme Code', route: 'xalmecode' }
  ];

  const modelList = ['Elarion', 'Nebula', 'Forge', 'Atlas'];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FDD935] selection:text-black font-sans relative z-0 overflow-x-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-[-2] bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      {/* Cyber Ambient Animated Blobs */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen gpu-accel">
        <div className="blob blob-1 will-change-transform" style={{ backgroundColor: '#FDD935' }}></div>
        <div className="blob blob-2 will-change-transform" style={{ backgroundColor: '#FFC94A' }}></div>
        <div className="blob blob-3 will-change-transform" style={{ backgroundColor: '#FEF08A' }}></div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[60px]"></div>
      </div>

      {/* Sticky Navigation Bar */}
      <nav
        ref={navRef}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3.5' : 'py-5'}`}
      >
        <div
          className="absolute inset-0 pointer-events-none liquid-glass-panel border-b border-white/10"
        ></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative z-10">
          <button
            onClick={() => { window.location.href = 'https://xoeris.com'; }}
            onMouseEnter={() => handleMouseEnter(null)}
            className="flex items-center group bg-transparent border-none p-0 cursor-pointer"
          >
            <div className="h-10 w-40 transition-transform duration-300 group-hover:scale-105">
              <img src="/xoeris_logo_emblem.png?v=2" alt="Xoeris" className="w-full h-full object-contain object-left" />
            </div>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-7">
            {/* Products Mega Menu Button */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('products')}
            >
              <button
                onClick={() => {
                  if (activeDropdown === 'products') setActiveDropdown(null);
                  else setActiveDropdown('products');
                }}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer ${
                  activeDropdown === 'products' ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>Products</span>
                <span className={`text-[10px] transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180' : ''}`}>▼</span>
              </button>
            </div>

            {/* Pricing Tab */}
            <div className="relative py-2" onMouseEnter={() => handleMouseEnter(null)}>
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
              <div className="relative" ref={userMenuTriggerRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full border border-white/20 hover:border-[#FDD935]/80 transition-all bg-white/5 hover:bg-white/10 cursor-pointer group shadow-[0_0_15px_rgba(253,217,53,0.15)]"
                  title={currentUser.name || currentUser.username || currentUser.email}
                >
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.name || currentUser.username}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#FDD935]/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FDD935] to-[#FFC94A] text-black font-black text-xs flex items-center justify-center ring-1 ring-white/30 uppercase">
                      {(currentUser.name || currentUser.username || currentUser.email || 'U')[0]}
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('chat')}
                  className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-[#FDD935] transition-all cursor-pointer border-none shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Try Xalme
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white bg-transparent border-none cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl py-6 px-6 flex flex-col gap-5 text-white max-h-[85vh] overflow-y-auto">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935]">Products</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                {productList.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { onNavigate(item.route); setMobileMenuOpen(false); }}
                    className={`text-left text-sm font-semibold bg-transparent border-none p-1 cursor-pointer ${
                      title === item.label ? 'text-[#FDD935]' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935]">Models</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                {modelList.map((model) => (
                  <button
                    key={model}
                    onClick={() => { onNavigate('under-construction'); setMobileMenuOpen(false); }}
                    className="text-left text-sm font-semibold text-gray-300 hover:text-white bg-transparent border-none p-1 cursor-pointer"
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => { onNavigate('pricing'); setMobileMenuOpen(false); }}
                className="text-left text-sm font-semibold text-gray-300 hover:text-white bg-transparent border-none p-1 cursor-pointer"
              >
                Pricing
              </button>
              {currentUser ? (
                <button
                  onClick={() => { clearSession(); setMobileMenuOpen(false); setCurrentUser(null); }}
                  className="text-left text-sm font-semibold text-red-400 bg-transparent border-none p-1 cursor-pointer"
                >
                  Log out ({currentUser.name || currentUser.username})
                </button>
              ) : (
                <button
                  onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                  className="text-left text-sm font-semibold text-[#FDD935] bg-transparent border-none p-1 cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Floating Mega Menu Dropdown (Outside <nav> to allow true backdrop blur through underlying page) */}
      {activeDropdown === 'products' && (
        <div
          className={`fixed left-1/2 -translate-x-[180px] z-[60] w-[540px] pointer-events-auto transition-all duration-300 ${isScrolled ? 'top-16' : 'top-20'}`}
          onMouseEnter={() => handleMouseEnter('products')}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="liquid-glass-panel rounded-3xl p-7 text-left border border-white/20 ring-1 ring-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Specular Sheen */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></div>
            <div className="absolute -top-12 left-1/3 w-72 h-28 bg-[#FDD935]/[0.08] rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-2 gap-8 relative z-10">
              {/* Column 1: Products */}
              <div className="border-r border-white/10 pr-6">
                <div className="text-xs font-semibold text-gray-400 mb-3 tracking-wide">Products</div>
                <ul className="space-y-2.5">
                  {productList.map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => { setActiveDropdown(null); onNavigate(item.route); }}
                        className={`text-sm font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer text-left w-full ${
                          title === item.label ? 'text-[#FDD935]' : 'text-white hover:text-[#FDD935]'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Models */}
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-3 tracking-wide">Models</div>
                <ul className="space-y-2.5">
                  {modelList.map((model) => (
                    <li key={model}>
                      <button
                        onClick={() => { setActiveDropdown(null); onNavigate('under-construction'); }}
                        className="text-sm font-semibold text-white hover:text-[#FDD935] transition-colors flex items-center justify-between group bg-transparent border-none p-0 cursor-pointer w-full text-left"
                      >
                        <span>{model}</span>
                        <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#FDD935] transition-colors" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 mt-7 pt-4 flex justify-between items-center text-xs relative z-10">
              <button
                onClick={() => { setActiveDropdown(null); onNavigate('pricing'); }}
                className="font-semibold text-white underline hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                Explore Subscriptions
              </button>
              <button
                onClick={() => { setActiveDropdown(null); onNavigate('chat'); }}
                className="px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-white font-medium flex items-center gap-1.5 transition-colors bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer"
              >
                <span>Try Xalme</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating User Dropdown */}
      {userDropdownOpen && currentUser && (
        <div
          ref={userDropdownMenuRef}
          className={`fixed right-6 md:right-12 z-[60] w-56 rounded-2xl p-3 liquid-glass-panel border border-white/20 ring-1 ring-white/10 shadow-2xl text-left pointer-events-auto transition-all duration-300 ${isScrolled ? 'top-16' : 'top-20'}`}
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
            className="w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-left"
          >
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Page Content */}
      <main className="relative z-10 pt-28">
        {children}
      </main>

      {/* Unified Cyber Footer matching xoeris.com */}
      <footer className="bg-black/80 backdrop-blur-3xl pt-20 pb-10 border-t border-[#FDD935]/20 mt-20 relative overflow-hidden text-white">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-[#FDD935] opacity-5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10">
          <div className="md:col-span-5">
            <button onClick={() => { window.location.href = 'https://xoeris.com'; }} className="flex items-center gap-3 mb-6 group inline-flex bg-transparent border-none p-0 cursor-pointer">
              <img src="/xoeris_logo_emblem.png?v=2" alt="Xoeris" className="h-10 w-40 object-contain object-left transition-transform duration-300 group-hover:scale-105" />
            </button>
            <p className="text-gray-400 max-w-sm font-medium leading-relaxed mb-6">
              Pioneering professional software ecosystems, modular operating system frameworks, and interactive digital computing environments.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Products</h4>
            <ul className="space-y-3 text-gray-400 font-medium text-sm">
              {productList.map((item) => (
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
              {modelList.map((model) => (
                <li key={model}>
                  <button onClick={() => onNavigate('under-construction')} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left flex items-center justify-between group w-full">
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
          <p>© 2018-2026 Xoeris. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-[#FDD935] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#FDD935] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
