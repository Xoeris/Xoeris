import React from 'react';
import { Cpu, Terminal, ArrowRight, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

export default function XalmeMainPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#705EBC]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#F59E0B]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="px-6 py-6 max-w-7xl w-full mx-auto flex justify-between items-center z-10">
        <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-2 group bg-transparent border-none text-gray-400 hover:text-white transition-colors">
          <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo" className="h-8 w-8 object-contain" />
        </button>
        <button
          onClick={() => onNavigate('chat')}
          className="px-5 py-2.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
        >
          Initialize Console
        </button>
      </header>

      {/* Hero Body */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto z-10 py-12">
        <div className="w-16 h-16 rounded-[1.25rem] bg-[#705EBC]/10 border border-[#705EBC]/20 flex items-center justify-center mb-8">
          <Cpu className="text-[#705EBC]" size={28} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 leading-none">
          Xalme Assistant
        </h1>
        <p className="text-base md:text-lg text-gray-400 font-medium leading-relaxed max-w-2xl mb-12">
          An AI assistant framework developed by Xoeris to support code generation, project planning, and systems configuration tasks.
        </p>

        {/* Action Panel Grid */}
        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
          <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 text-left flex flex-col justify-between">
            <div>
              <Terminal className="text-[#705EBC] mb-4" size={24} />
              <h3 className="text-sm font-black uppercase tracking-wider mb-2">Interactive Chat</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Access the chat dashboard using developer credentials to run code execution tests.</p>
            </div>
            <button
              onClick={() => onNavigate('chat')}
              className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#705EBC] hover:text-white transition-colors bg-transparent border-none p-0 text-left"
            >
              Open chat console <ArrowRight size={14} />
            </button>
          </div>

          <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 text-left flex flex-col justify-between">
            <div>
              <ShieldCheck className="text-[#705EBC] mb-4" size={24} />
              <h3 className="text-sm font-black uppercase tracking-wider mb-2">Platform Integration</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Xalme integrates into the XIME workspace ecosystem to provide runtime helper utilities.</p>
            </div>
            <button
              onClick={() => onNavigate('xoeris')}
              className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors bg-transparent border-none p-0 text-left"
            >
              Go to platform <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest py-8 z-10">
        © 2026 Xoeris. All rights reserved.
      </footer>
    </div>
  );
}
