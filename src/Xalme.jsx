import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Cpu, Layers, Terminal } from 'lucide-react';
import SoftwareLayout from './components/SoftwareLayout';
import FadeIn from './components/FadeIn';

export default function Xalme({ onNavigate }) {
  const capabilities = [
    {
      title: "Multi-Model Reasoning Matrix",
      desc: "Dynamic routing between Atlas 5, Forge 6, and Nebula 7 models tailored to speed and task depth.",
      tag: "Multi-Tier AI"
    },
    {
      title: "Interactive Web, Desktop & Mobile Sync",
      desc: "Synchronize conversations, contextual threads, and memory artifacts across all client devices seamlessly.",
      tag: "Ecosystem Sync"
    },
    {
      title: "Hierarchical Multi-Agent Coordination",
      desc: "Nebula 7 coordinates Plan, Explore, Execution, and Critic subagents for autonomous large-scale engineering.",
      tag: "Agentic Hierarchy"
    },
    {
      title: "High-Assurance Security Enclaves",
      desc: "Elarion 7 operates in air-gapped confidential computing enclaves with Elarion Capability Gateway (ECG) and Merkle audit ledgers (Not for Public).",
      tag: "Zero-Knowledge"
    }
  ];

  const models = [
    { 
      name: "Atlas 5", 
      tier: "Entry-Level • Gen 5",
      speed: "< 15ms TTFT • > 120 tok/s",
      desc: "High-throughput draft engine built in C++20 with Grouped-Query Attention (GQA), zero-allocation rolling KV caches, and speculative decoding draft acceleration for local workstations and edge hardware.",
      isPublic: true
    },
    { 
      name: "Forge 6", 
      tier: "Mid-Level • Gen 6",
      speed: "1M Context • SWE-bench > 74.5%",
      desc: "Autonomous software engineering flagship with 1,000,000 tokens context, RoPE SwiGLU decoder-only transformer, polyglot compilation, and surgical multi-file codebase refactoring.",
      isPublic: true
    },
    { 
      name: "Nebula 7", 
      tier: "Top-Level • Gen 7",
      speed: "2M+ Context • GPQA > 72.8%",
      desc: "Frontier general intelligence summit with hierarchical L1/L2/L3 context caching, Monte Carlo Tree-of-Thought (ToT) reasoning, formal proofs, and master coordination of specialized subagents.",
      isPublic: true
    },
    { 
      name: "Elarion 7", 
      tier: "Restricted • Gen 7",
      speed: "Air-Gapped Confidential Enclave",
      desc: "Privileged cybersecurity intelligence derived from Nebula 7, running within air-gapped confidential hardware enclaves (SEV-SNP/TDX) with Elarion Capability Gateway (ECG), dual-authorization, and append-only Merkle auditing.",
      isPublic: false
    }
  ];

  return (
    <SoftwareLayout
      title="Xalme"
      subtitle="Xoeris Advanced Large Language Model Enhanced"
      onNavigate={onNavigate}
    >
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn className="max-w-4xl flex flex-col items-center">
          <img 
            src="/xoeris_logo_color.png?v=2" 
            alt="Xalme" 
            className="w-20 h-20 mb-6 object-contain drop-shadow-[0_0_25px_rgba(253,217,53,0.35)]" 
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FDD935] uppercase tracking-widest mb-8 backdrop-blur-md">
            <Sparkles size={14} className="text-[#FDD935]" />
            Xoeris Advanced Large Language Model Enhanced
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 text-white">
            Xalme
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed mb-12">
            The foundational artificial intelligence suite engineered by Xoeris. Designed for profound conversational reasoning, system planning, and autonomous task execution.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate ? onNavigate('chat') : window.location.href = '/chat'}
              className="px-8 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(253,217,53,0.4)] flex items-center gap-2 cursor-pointer border-none"
            >
              Start Chatting <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer"
            >
              Pricing & Limits
            </button>
          </div>
        </FadeIn>
      </section>

      {/* Model Family Showcase */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Model Ecosystem</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Four Distinct Reasoning Engines.</h2>
          <p className="text-sm text-gray-400 mt-4">
            From sub-15ms edge speculative drafting to air-gapped confidential cybersecurity enclaves.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((m, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl h-full flex flex-col justify-between hover:border-[#FDD935]/40 transition-colors">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#FDD935] mb-1">{m.tier}</div>
                  <div className="text-[11px] font-mono text-gray-400 mb-3">{m.speed}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{m.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{m.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold">
                  {m.isPublic ? (
                    <>
                      <span className="text-gray-300">Available in <strong className="text-[#FDD935]">Ultra</strong></span>
                      <CheckCircle2 size={14} className="text-[#FDD935]" />
                    </>
                  ) : (
                    <>
                      <span className="text-red-400 font-bold uppercase tracking-wider">Not for Public</span>
                      <Shield size={14} className="text-red-400" />
                    </>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Architectural Pillars</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Engineered for Everyday Excellence.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {capabilities.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FDD935]/50 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col justify-between group">
                <div>
                  <div className="inline-block px-3 py-1 rounded-lg bg-[#FDD935]/10 border border-[#FDD935]/20 text-[10px] font-bold text-[#FDD935] uppercase tracking-wider mb-6">
                    {item.tag}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-[#FDD935] transition-colors">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm font-normal">{item.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span>Stateful Multi-Session</span>
                  <CheckCircle2 size={16} className="text-[#FDD935]" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FDD935]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">Start Your Session with Xalme.</h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base mb-10 font-normal">
            Web version accessible exclusively to Ultra members and Administrators, with desktop and Android app access available across tiers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate ? onNavigate('chat') : window.location.href = '/chat'}
              className="px-10 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_25px_rgba(253,217,53,0.35)]"
            >
              Launch Chat Dashboard
            </button>
            <button 
              onClick={() => { window.location.href = 'https://xoeris.com'; }}
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              Back to Xoeris
            </button>
          </div>
        </div>
      </section>
    </SoftwareLayout>
  );
}
