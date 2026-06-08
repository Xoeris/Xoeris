import React, { useState, useEffect } from 'react';
import { Menu, X, Hexagon, Database, Activity, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';
import FadeIn from './components/FadeIn';

export default function XoerisPage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    <div className="animate-fade-in relative z-10">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 gpu-accel ${isScrolled ? 'py-4 shadow-lg backdrop-blur-xl bg-black/40 border-b border-white/10' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="/xoeris" onClick={(e) => { e.preventDefault(); onNavigate('xoeris'); }} className="flex items-center group">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img src="/xoeris-logo.png" alt="Xoeris Logo" className="w-full h-full object-contain" />
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Products</a>
            <a href="#solutions" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Solutions</a>
            <a href="#resources" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Resources</a>
            <a href="/subscription" onClick={(e) => { e.preventDefault(); onNavigate('subscriptions'); }} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</a>
            
            <div className="w-px h-6 bg-white/20"></div>

            <div className="flex items-center gap-4">
              <a href="https://acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('acelbyte'); }} className="flex items-center gap-1.5 text-sm font-bold text-[#FDD935] hover:text-white transition-colors">
                <img src="/acelbyte-logo.png" alt="Acelbyte" className="w-4 h-4 object-contain" /> Acelbyte
              </a>
              <a href="https://loomastudio.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('looma'); }} className="flex items-center gap-1.5 text-sm font-bold text-[#F0805E] hover:text-white transition-colors">
                <img src="/looma-studio-logo.png" alt="Looma" className="w-4 h-4 object-contain" /> Looma Studio
              </a>
            </div>
            <a href="#contact" className="px-5 py-2.5 text-sm font-bold rounded-full transition-transform hover:scale-105" style={{ backgroundColor: '#5A4DB2', color: '#fff' }}>
              Request Demo
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-xl py-4 flex flex-col items-center gap-4 text-white">
            <a href="#products" className="text-lg font-medium text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Products</a>
            <a href="#solutions" className="text-lg font-medium text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
            <a href="#resources" className="text-lg font-medium text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Resources</a>
            <a href="/subscription" className="text-lg font-medium text-gray-300 hover:text-white" onClick={(e) => { e.preventDefault(); onNavigate('subscriptions'); setMobileMenuOpen(false); }}>Pricing</a>
            <div className="w-1/2 h-px bg-white/10 my-2"></div>
            <a href="https://acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('acelbyte'); setMobileMenuOpen(false); }} className="text-lg font-bold text-[#FDD935] py-2 flex items-center gap-2">
              <img src="/acelbyte-logo.png" alt="Acelbyte" className="w-5 h-5 object-contain" /> Switch to Acelbyte
            </a>
            <a href="https://loomastudio.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('looma'); setMobileMenuOpen(false); }} className="text-lg font-bold text-[#F0805E] py-2 flex items-center gap-2">
              <img src="/looma-studio-logo.png" alt="Looma" className="w-5 h-5 object-contain" /> Switch to Looma
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="z-10 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A4DB2]/20 border border-[#5A4DB2]/50 text-sm font-medium mb-6 text-indigo-200 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5A4DB2' }}></span>
              Introducing Xoeris Intelligence Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-white">
              Data, <br/> Decoded.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-lg leading-relaxed">
              Transform raw data into strategic foresight. Xoeris provides advanced analytics and machine learning pipelines for modern enterprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#products" className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold transition-all hover:-translate-y-1 rounded-full text-white" style={{ backgroundColor: '#5A4DB2' }}>
                View Solutions <ArrowRight size={20} />
              </a>
              <a href="/loomastudio" onClick={(e) => { e.preventDefault(); onNavigate('looma'); }} className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold border border-white/20 transition-all hover:bg-white/10 rounded-full bg-white/5 backdrop-blur-sm text-white">
                <img src="/looma-studio-logo.png" alt="Looma" className="w-5 h-5 object-contain" /> Design Partner
              </a>
            </div>
          </div>

          {/* Hero Visual - Data/AI Motif */}
          <div className="relative flex justify-center lg:justify-end items-center h-80 lg:h-full z-0 perspective-1000 gpu-accel">
            <div className="relative w-full max-w-md transform rotate-[5deg] hover:rotate-0 transition-transform duration-700 ease-out group flex justify-center will-change-transform">
              <div className="relative w-64 h-80 flex items-center justify-center">
                {/* Abstract Data Hexagons */}
                <div className="absolute w-40 h-40 border-2 border-[#5A4DB2] rounded-3xl transform rotate-45 transition-all duration-500 group-hover:scale-110 bg-[#5A4DB2]/10 backdrop-blur-md flex items-center justify-center z-20 shadow-[0_0_50px_rgba(90,77,178,0.4)] will-change-transform">
                   <Database size={48} className="text-[#FDD935] -rotate-45" />
                </div>
                <div className="absolute w-40 h-40 border-2 border-[#F0805E] rounded-3xl transform rotate-45 translate-x-12 translate-y-12 transition-all duration-700 group-hover:translate-x-16 group-hover:translate-y-16 bg-[#F0805E]/10 backdrop-blur-sm z-10 will-change-transform"></div>
                <div className="absolute w-40 h-40 border-2 border-[#FDD935] rounded-3xl transform rotate-45 -translate-x-12 -translate-y-12 transition-all duration-700 group-hover:-translate-x-16 group-hover:-translate-y-16 bg-[#FDD935]/10 backdrop-blur-sm z-10 will-change-transform"></div>
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 border-2 border-dashed rounded-full animate-spin-slow opacity-40" style={{ borderColor: '#FDD935', animationDuration: '15s' }}></div>
              <div className="absolute bottom-0 -left-10 w-32 h-32 border border-white/20 backdrop-blur-sm rounded-full animate-pulse opacity-30 transform scale-y-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="products" className="py-24 px-6 md:px-12 relative text-white">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="mb-16 md:w-2/3">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise Intelligence</h2>
            <p className="text-xl text-gray-300">Unify your data sources and deploy predictive models with zero friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/5 backdrop-blur-md p-8 border border-white/10 hover:bg-white/10 hover:border-[#5A4DB2] transition-all duration-300 relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" style={{ backgroundColor: '#5A4DB2' }}></div>
              <Database size={40} style={{ color: '#5A4DB2' }} className="mb-6" />
              <h3 className="text-2xl font-bold mb-4">Data Pipelines</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Automated ETL workflows that clean, structure, and securely store your data across multi-cloud environments.
              </p>
              <a href="#" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: '#5A4DB2' }}>
                View Pipelines <ChevronRight size={16} />
              </a>
            </div>

            <div className="group bg-white/5 backdrop-blur-md p-8 border border-white/10 hover:bg-white/10 hover:border-[#FDD935] transition-all duration-300 relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" style={{ backgroundColor: '#FDD935' }}></div>
              <Activity size={40} style={{ color: '#FDD935' }} className="mb-6" />
              <h3 className="text-2xl font-bold mb-4">Predictive AI</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Deploy state-of-the-art machine learning models directly into your applications to forecast trends and user behaviors.
              </p>
              <a href="#" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: '#FDD935' }}>
                View AI Models <ChevronRight size={16} />
              </a>
            </div>

            <div className="group bg-white/5 backdrop-blur-md p-8 border border-white/10 hover:bg-white/10 hover:border-[#F0805E] transition-all duration-300 relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" style={{ backgroundColor: '#F0805E' }}></div>
              <TrendingUp size={40} style={{ color: '#F0805E' }} className="mb-6" />
              <h3 className="text-2xl font-bold mb-4">Visual Dashboards</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Real-time, customizable business intelligence dashboards that turn complex datasets into clear, actionable insights.
              </p>
              <a href="#" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: '#F0805E' }}>
                View Dashboards <ChevronRight size={16} />
              </a>
            </div>

            <div className="group bg-white/5 backdrop-blur-md p-8 border border-white/10 hover:bg-white/10 hover:border-[#705EBC] transition-all duration-300 relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-1 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" style={{ backgroundColor: '#705EBC' }}></div>
              <Smartphone size={40} style={{ color: '#705EBC' }} className="mb-6" />
              <h3 className="text-2xl font-bold mb-4">SAMUDRA</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Integrated maritime information system for fishermen, featuring fish tracking, weather, and solar-powered connectivity.
              </p>
              <a
                href="/Voltrix/SAMUDRA/app"
                onClick={(e) => { e.preventDefault(); onNavigate('samudra'); }}
                className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                style={{ color: '#705EBC' }}
              >
                Launch App <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl pt-16 pb-8 border-t border-white/10 mt-20 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <a href="/xoeris" onClick={(e) => { e.preventDefault(); onNavigate('xoeris'); }} className="flex items-center gap-3 mb-6 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img src="/xoeris-logo.png" alt="Xoeris Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-custom font-bold">Xoeris</span>
            </a>
            <p className="text-gray-400 max-w-sm">
              Empowering organizations with intelligent data pipelines and predictive analytics.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-white">Solutions</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-[#5A4DB2] transition-colors">Data Engineering</a></li>
              <li><a href="#" className="hover:text-[#5A4DB2] transition-colors">Machine Learning</a></li>
              <li><a href="#" className="hover:text-[#5A4DB2] transition-colors">Business Intelligence</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-white">Partner Network</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="https://acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('acelbyte'); }} className="hover:text-[#FDD935] transition-colors flex items-center gap-2"><img src="/acelbyte-logo.png" className="w-4 h-4 object-contain" /> Acelbyte Infra</a></li>
              <li><a href="https://loomastudio.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('looma'); }} className="hover:text-[#F0805E] transition-colors flex items-center gap-2"><img src="/looma-studio-logo.png" className="w-4 h-4 object-contain" /> Looma Studio</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Xoeris Analytics. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
