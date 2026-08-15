import React from 'react';
import { ShieldAlert, Globe, Server, ArrowLeft } from 'lucide-react';

export default function ErrorPage({ title, errorType }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 font-sans relative overflow-hidden">
      {/* Background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-center max-w-5xl w-full mx-auto py-4">
        <div className="flex items-center gap-2">
          <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo" className="h-6 w-6 object-contain" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-500">Xoeris Network</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-[1.25rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 animate-pulse">
          <ShieldAlert className="text-red-500" size={32} />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4 uppercase">{title || 'Forbidden Access'}</h1>
        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
          The requested system node is restricted. Domain mapping failed or host routing credentials not provided. If this is an API node, resolve endpoints using authorized headers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = 'https://xoeris.com'}
            className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
          >
            Return to main site
          </button>
          <div className="px-6 py-3 bg-white/[0.03] border border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
            <Server size={12} />
            <span>Host: {window.location.hostname}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest py-4">
        © 2026 Xoeris. All rights reserved.
      </footer>
    </div>
  );
}
