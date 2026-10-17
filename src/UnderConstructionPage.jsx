import React from 'react';
import { Hammer, HardHat, RefreshCw, Server } from 'lucide-react';

export default function UnderConstructionPage({ 
  title = "Under Construction", 
  subtitle = "This service is currently undergoing scheduled development. Modules remain in private staging during construction.",
  moduleTag = "Under Development",
  onNavigate 
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 font-sans relative overflow-hidden">
      {/* Background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFC94A]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-center max-w-5xl w-full mx-auto py-4">
        <button 
          onClick={() => onNavigate ? onNavigate('xoeris') : (window.location.href = 'https://xoeris.com')} 
          className="flex items-center group bg-transparent border-none p-0 cursor-pointer"
        >
          <img src="/xoeris_logo_emblem.png?v=2" alt="Xoeris Logo Emblem" className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-[1.25rem] bg-[#FFC94A]/10 border border-[#FFC94A]/20 flex items-center justify-center mb-8 animate-pulse shadow-[0_0_30px_rgba(255,201,74,0.15)]">
          <Hammer className="text-[#FFC94A]" size={32} />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-[#FFC94A]/10 border border-[#FFC94A]/20 text-[#FFC94A] text-[10px] font-mono uppercase tracking-widest mb-4">
          {moduleTag}
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 uppercase">{title}</h1>
        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate ? onNavigate('xoeris') : (window.location.href = 'https://xoeris.com')}
            className="px-6 py-3 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform cursor-pointer border-none shadow-[0_0_20px_rgba(253,217,53,0.3)]"
          >
            Return to main site
          </button>
          <div className="px-6 py-3 bg-white/[0.03] border border-white/10 text-gray-400 text-[10px] font-mono uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
            <Server size={12} className="text-[#FDD935]" />
            <span>Deployment Status: In Development</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest py-4">
        © 2018-2026 Xoeris. All rights reserved.
      </footer>
    </div>
  );
}
