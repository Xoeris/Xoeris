import React from 'react';
import { Terminal, Code2, Cpu, Globe, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import FadeIn from './components/FadeIn';

export default function DeveloperPortal({ onNavigate }) {
  const apis = [
    { name: "XESC Core SDK", status: "Operational", lat: "0.2ms", version: "v9.6.1" },
    { name: "Zenith Physics API", status: "Operational", lat: "0.8ms", version: "v4.0.2" },
    { name: "Netwave Node Link", status: "Operational", lat: "1.2ms", version: "v2.1.0" },
    { name: "Drivon Storage SDK", status: "Degraded", lat: "45ms", version: "v5.4.4" }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-12">
      <FadeIn className="max-w-[1400px] mx-auto">
        <header className="mb-24">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400 mb-8">
            <Terminal size={14} /> Developer Environment Active
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 uppercase">Build the <br/> Impossible.</h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed font-medium">Access the raw power of the Xoeris technology stack. Integrate neural intelligence, distributed storage, and global networking into your applications.</p>
        </header>

        <section className="grid lg:grid-cols-3 gap-8 mb-32">
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
             <h3 className="text-2xl font-black mb-8 uppercase">Ecosystem Health</h3>
             <div className="space-y-6">
                {apis.map((api, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                    <div>
                      <h4 className="font-bold mb-1">{api.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{api.version}</p>
                    </div>
                    <div className="flex gap-10 items-center">
                       <div className="text-right">
                          <p className="text-xs font-bold text-gray-400 mb-1">Latency</p>
                          <p className="text-sm font-black">{api.lat}</p>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${api.status === 'Operational' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                         {api.status}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between">
             <div>
                <Code2 size={40} className="text-blue-500 mb-8" />
                <h3 className="text-2xl font-black mb-4 uppercase">Quick Start</h3>
                <p className="text-gray-400 font-medium leading-relaxed">Initialize the Xoeris environment in your local machine with a single command.</p>
             </div>
             <div className="bg-black border border-white/10 rounded-2xl p-6 font-mono text-sm overflow-x-auto my-10">
                <span className="text-blue-500">$</span> xoeris login --token <br/>
                <span className="text-blue-500">$</span> xoeris init universe-01
             </div>
             <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500 hover:gap-4 transition-all">
                Copy CLI Token <ArrowRight size={14}/>
             </button>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { title: "Documentation", desc: "Unified API references and architectural whitepapers.", icon: ShieldCheck },
             { title: "SDK Downloads", desc: "Native binaries for Aether OS, Windows, and Linux.", icon: Zap },
             { title: "Node Status", desc: "Real-time telemetry of global Netwave nodes.", icon: Globe },
             { title: "Community", desc: "Join the architects building the next epoch.", icon: Cpu }
           ].map((card, i) => (
             <div key={i} className="group bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:bg-white/[0.06] transition-all cursor-pointer">
                <card.icon size={24} className="text-gray-500 mb-6 group-hover:text-white transition-colors" />
                <h4 className="text-lg font-black mb-4 uppercase">{card.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{card.desc}</p>
             </div>
           ))}
        </section>
      </FadeIn>
    </div>
  );
}
