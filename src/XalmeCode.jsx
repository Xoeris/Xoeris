import React from 'react';
import { ArrowRight, Braces, Sparkles, CheckCircle2 } from 'lucide-react';
import SoftwareLayout from './components/SoftwareLayout';
import FadeIn from './components/FadeIn';

export default function XalmeCode({ onNavigate }) {
  const features = [
    {
      title: "Context-Aware Multi-Repository Synthesis",
      desc: "Ingests whole-workspace abstract syntax trees, cross-file imports, and package definitions to generate flawless drop-in code.",
      badge: "Deep AST Engine"
    },
    {
      title: "In-Browser Web IDE & Isolated Sandbox",
      desc: "Zero-setup interactive coding environment running in WebAssembly, complete with live execution and instant visual diffs.",
      badge: "Web Sandbox"
    },
    {
      title: "Deterministic Code Auditing & Repair",
      desc: "Identify memory leaks, race conditions, edge-case vulnerabilities, and API regressions with automated proposed patches.",
      badge: "Autonomous Audit"
    },
    {
      title: "Direct Horizone & Zenith Integration",
      desc: "Direct integration with Horizone Engine and Zenith architecture pipelines for shader compile and systems development.",
      badge: "Toolchain Bridge"
    }
  ];

  const languages = [
    { name: "C++23 & C", tag: "Native Systems" },
    { name: "Rust", tag: "Memory Safe" },
    { name: "Python 3.12+", tag: "Scientific & AI" },
    { name: "TypeScript / React", tag: "Full-Stack Web" },
    { name: "WGSL & HLSL", tag: "Graphics Shaders" },
    { name: "Go & Kotlin", tag: "Microservices & Android" }
  ];

  return (
    <SoftwareLayout
      title="Xalme Code"
      subtitle="Autonomous Software Engineering Intelligence"
      onNavigate={onNavigate}
    >
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn className="max-w-4xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FDD935] uppercase tracking-widest mb-8 backdrop-blur-md">
            <Braces size={14} className="text-[#FDD935]" />
            Autonomous Software Engineering Intelligence
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
            Xalme <span className="text-[#FDD935]">Code.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed mb-12">
            The dedicated AI coding environment designed for serious developers. Featuring multi-file refactoring, syntax generation, and seamless web deployment.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <button 
              onClick={() => onNavigate ? onNavigate('chat') : window.location.href = '/chat'}
              className="px-8 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(253,217,53,0.4)] flex items-center gap-2 cursor-pointer border-none"
            >
              Open Web Workspace <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer"
            >
              Ultra Plan Features
            </button>
          </div>
        </FadeIn>

        {/* Live Code Generation Visual Preview */}
        <FadeIn delay={150} className="w-full max-w-5xl">
          <div className="rounded-3xl border border-white/15 bg-black/60 backdrop-blur-3xl p-4 sm:p-6 text-left shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="text-xs font-mono text-gray-400 ml-3">xalme-code // optimizer.ts</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#FDD935]">
                <Sparkles size={13} /> Multi-Pass Optimization Applied
              </div>
            </div>

            <pre className="font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto p-4 bg-black/40 rounded-xl leading-relaxed">
{`export async function synthesizePipeline<T>(input: Stream<T>): Promise<PipelineResult> {
  // Analyzed 42 referenced files across your workspace
  const resolved = await resolveAstContext(input.manifest);
  const vectorized = await computeTensorWeights(resolved);
  
  return {
    status: 'optimized',
    throughputGain: '340%',
    zeroResidualAllocations: true
  };
}`}
            </pre>
          </div>
        </FadeIn>
      </section>

      {/* Supported Languages */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Language Support</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Full Native Grammar Parsing.</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map((l, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-center hover:border-[#FDD935]/40 transition-colors">
                <div className="text-sm font-bold text-white mb-1">{l.name}</div>
                <div className="text-[10px] text-[#FDD935] uppercase tracking-wider font-semibold">{l.tag}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Engineering Tools</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Built to Ship Systems Faster.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FDD935]/50 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col justify-between group">
                <div>
                  <div className="inline-block px-3 py-1 rounded-lg bg-[#FDD935]/10 border border-[#FDD935]/20 text-[10px] font-bold text-[#FDD935] uppercase tracking-wider mb-6">
                    {item.badge}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-[#FDD935] transition-colors">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm font-normal">{item.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span>Ultra Tier Exclusive</span>
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
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#FDD935]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">Unlock Xalme Code on Web.</h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base mb-10 font-normal">
            Included in the Xoeris Ultra plan with up to 10x more usage, high priority support, and alpha features.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-10 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_25px_rgba(253,217,53,0.35)]"
            >
              Get Ultra Tier
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
