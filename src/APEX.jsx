import React, { useState } from 'react';
import { 
  ArrowRight, Smartphone, Monitor, Terminal, Layers, Cpu, Shield, 
  HardDrive, Wrench, FileCode, CheckCircle2, ChevronRight, Zap, 
  ExternalLink, Sparkles, FolderArchive, Play, Sliders
} from 'lucide-react';
import SoftwareLayout from './components/SoftwareLayout';
import FadeIn from './components/FadeIn';

export default function APEX({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('desktop');

  const desktopPages = [
    { name: "Dashboard (Overview)", desc: "Device status, recent connected devices, recent commands, and hardware activity at a glance." },
    { name: "RBK (ROM Workshop)", desc: "Full ROM unpacker, payload.bin extraction, partition repack, Super Image packer, and debloater." },
    { name: "Commands", desc: "Interactive ADB and fastboot runner with presets (reboot bootloader/recovery, getprop, fastboot commands)." },
    { name: "Logs", desc: "Full CLI session output with ANSI-color stripping, copy/save options, and automatic scroll synchronization." },
    { name: "Analytics", desc: "Commands run, success rate vs last session, average execution times, flash operations by partition, CSV export." },
    { name: "Settings", desc: "CPU thread maximization, dedicated RAM allocation (up to 75% physical), GPU acceleration, and activation." },
    { name: "About", desc: "Credits, architectural acknowledgements, and open-source licensing references." }
  ];

  const formatSupport = [
    { format: "ext4", support: "Read, walk, extract (100% managed C#)" },
    { format: "EROFS", support: "Plain, inline, chunk-based, & LZ4-compressed (legacy + compact index)" },
    { format: "Android sparse", support: "Seekable read-only view (RAW / FILL / DONT_CARE) and unsparse" },
    { format: "super.img (LP)", support: "Geometry + metadata v10.x, primary/backup slots, per-partition extraction" },
    { format: "NEW.DAT / .br", support: "Sdat2Img native conversion pipeline" },
    { format: "Format Detector", support: "Autodetects 30+ archive, binary, and partition signatures" }
  ];

  const platformSupport = [
    { capability: "Desktop App", windows: "Yes", linux: "Yes", macos: "Yes" },
    { capability: "ext4 / EROFS / sparse / super reading", windows: "Yes (Managed)", linux: "Yes (Managed)", macos: "Yes (Managed)" },
    { capability: "Hard-link Import", windows: "Yes (CreateHardLinkW)", linux: "Yes (link)", macos: "Yes (link)" },
    { capability: "EROFS Repack", windows: "Yes", linux: "Yes", macos: "No" },
    { capability: "magiskboot lab", windows: "Yes", linux: "Yes", macos: "Yes" }
  ];

  const rbkTools = [
    {
      title: "ROM Extractor",
      desc: "One-click pipeline from package → super.img → logical partitions → directory trees with per-partition benchmark timings. Built-in payload-dumper-go for A/B OTA packages."
    },
    {
      title: "Super Image Packer",
      desc: "Built-in lpmake integration for dynamic partition images. Odin-style packaging into .tar with optional LZ4 (.img.lz4) and MD5 verification."
    },
    {
      title: "Partition Browser & Compare",
      desc: "Browse partition images without extracting. Side-by-side tree compare (stock vs custom) with filters for Added, Removed, Content, and Kind differences."
    },
    {
      title: "Apps & Debloater",
      desc: "Full APK catalog by partition with automated Risk Verdicts (Safe, Caution, Risky, Critical). Safely backup and restore APKs with zero data loss."
    },
    {
      title: "Lab & Boot Patching",
      desc: "Unpack/repack boot, init_boot, vendor_boot, and recovery with magiskboot. Remove verity and force-encrypt, patch vbmeta, and apply bundled Magisk libraries."
    },
    {
      title: "APK Workshop",
      desc: "Decompile, recompile, sign, and merge using Apktool and APKEditor. Smali/baksmali disassembly, zipalign, and apksigner cryptographic signing."
    }
  ];

  const androidFeatures = [
    "RBK on phone: unpack and pack super.img (lpunpack / lpmake) directly on device",
    "Single-partition repacking with configurable compression and access modes",
    "vbmeta patching and Magisk boot-image patching on-the-fly",
    "APK decompile, silent root installation, and DEX ↔ smali translation",
    "Integrated Editors: Boot & recovery scene, Hex editor, Smali editor, Text editor",
    "Native apex-terminal emulator with full root shell capabilities",
    "Integrated Xoeris File Manager with permission inspect, storage overview, and media viewer"
  ];

  return (
    <SoftwareLayout
      title="APEX"
      subtitle="A cross-platform Android firmware toolkit"
      onNavigate={onNavigate}
    >
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn className="max-w-4xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FDD935] uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-ping"></span>
            Version 1.0.0 • Built with .NET 10
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Xoeris <span className="text-[#FDD935]">APEX.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white font-bold max-w-3xl leading-snug mb-6">
            A cross-platform Android firmware toolkit. Unpack, browse, modify, rebuild and flash Android firmware from one desktop app without WSL or command-line chaos.
          </p>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-normal leading-relaxed mb-10">
            Native C# ext4, EROFS, sparse, and super.img readers. Runs natively on Windows, Linux, and macOS with companion Android support.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button 
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-8 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(253,217,53,0.4)] flex items-center gap-2 cursor-pointer border-none"
            >
              Get APEX with Pro <ArrowRight size={16} />
            </button>
            <a 
              href="https://github.com/Xoeris/APEX" 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
            >
              GitHub Repository <ExternalLink size={14} />
            </a>
          </div>
        </FadeIn>

        {/* High-Resolution App Mockup */}
        <FadeIn delay={150} className="w-full max-w-6xl mt-4">
          <div className="rounded-3xl border border-white/15 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)] bg-black/60 relative group">
            <img 
              src="https://github.com/user-attachments/assets/b1c78cd6-3e40-464a-8119-82955447a64e" 
              alt="Xoeris APEX Mockup" 
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-xs text-gray-300 font-mono">
              <span>APEX Desktop // ROM Workshop (RBK) Interface</span>
              <span className="text-[#FDD935] font-bold">100% Native Managed Pipeline</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Benchmark & Performance Metric Banner */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border-l-2 border-[#FDD935]/40 pl-5">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">≈ 3m 41s</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935] mb-1">Extraction Benchmark</div>
              <div className="text-[11px] text-gray-400">47 partitions on NVMe SSD</div>
            </div>
            <div className="border-l-2 border-[#FDD935]/40 pl-5">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">4–7× Faster</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935] mb-1">Streaming Writes</div>
              <div className="text-[11px] text-gray-400">vs whole-file extractors</div>
            </div>
            <div className="border-l-2 border-[#FDD935]/40 pl-5">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">~120 MB</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935] mb-1">Low Memory Footprint</div>
              <div className="text-[11px] text-gray-400">Maintains 75% headroom</div>
            </div>
            <div className="border-l-2 border-[#FDD935]/40 pl-5">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">0 WSL</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935] mb-1">No Extra Dependencies</div>
              <div className="text-[11px] text-gray-400">Native C# readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Architecture Flow */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Architectural Workflow</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">How APEX Operates.</h2>
          <p className="text-gray-400 text-sm mt-3 font-normal">
            Partitions are extracted sequentially with internal parallelism to avoid thrashing storage controllers and sustain maximum write throughput.
          </p>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="p-8 sm:p-12 rounded-3xl bg-black/60 border border-white/10 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Stage 1 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between relative group hover:border-[#FDD935]/50 transition-all">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FDD935]/10 text-[#FDD935] mb-3 inline-block">
                  Stage 01 • Ingest
                </span>
                <h4 className="text-base font-bold text-white mb-2">Firmware Zip</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  Hard-link directly into Source/ staging without redundant disk duplication.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-gray-400 font-mono">
                → Source/ directory
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between relative group hover:border-[#FDD935]/50 transition-all">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FDD935]/10 text-[#FDD935] mb-3 inline-block">
                  Stage 02 • Demux
                </span>
                <h4 className="text-base font-bold text-white mb-2">Super & Images</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  Built-in sparse + LP readers extract raw super.img, boot, vbmeta, and recovery images.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#FDD935] font-mono">
                Built-in Sparse & LP
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between relative group hover:border-[#FDD935]/50 transition-all">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FDD935]/10 text-[#FDD935] mb-3 inline-block">
                  Stage 03 • Filesystems
                </span>
                <h4 className="text-base font-bold text-white mb-2">System / Vendor</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  Managed C# readers walk ext4 and EROFS (plain, inline, chunk, and LZ4 compressed).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#FDD935] font-mono">
                ext4 & EROFS Engines
              </div>
            </div>

            {/* Stage 4 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between relative group hover:border-[#FDD935]/50 transition-all">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FDD935]/10 text-[#FDD935] mb-3 inline-block">
                  Stage 04 • Output
                </span>
                <h4 className="text-base font-bold text-white mb-2">Streaming Writes</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  Parallel file writers stream extracted contents directly into your project tree.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#FDD935] font-mono">
                → Project Workspace
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
            <span>Direct managed pipeline written in pure .NET 10</span>
            <span className="text-[#FDD935] font-semibold mt-2 sm:mt-0">Zero WSL or Linux VM required</span>
          </div>
        </div>
      </section>

      {/* RBK Workshop Modules */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">ROM Workshop Modules</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Comprehensive Firmware Suite.</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rbkTools.map((tool, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FDD935]/50 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FDD935]/10 border border-[#FDD935]/20 flex items-center justify-center text-[#FDD935] mb-6 group-hover:scale-110 transition-transform">
                    <Wrench size={20} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-3 text-white group-hover:text-[#FDD935] transition-colors">{tool.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{tool.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#FDD935] font-semibold">
                  <span>RBK Module</span>
                  <CheckCircle2 size={15} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Dual Platform Switcher: Desktop Pages vs Android App */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'desktop' 
                ? 'bg-[#FDD935] text-black border-[#FDD935] shadow-[0_0_20px_rgba(253,217,53,0.3)]' 
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
          >
            Desktop App Features
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'android' 
                ? 'bg-[#FDD935] text-black border-[#FDD935] shadow-[0_0_20px_rgba(253,217,53,0.3)]' 
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
          >
            Companion Android App
          </button>
        </div>

        {activeTab === 'desktop' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {desktopPages.map((page, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#FDD935]/10 flex items-center justify-center text-[#FDD935] shrink-0 mt-1">
                  <Monitor size={16} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{page.name}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{page.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="text-[#FDD935]" size={28} />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">Xoeris APEX for Android</h3>
                <p className="text-xs text-gray-400">Package: com.xoeris.android.app.apex (minSdk 24 • targetSdk 36)</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {androidFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300">
                  <CheckCircle2 size={16} className="text-[#FDD935] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Format & Platform Support Tables */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Format Support */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg font-bold uppercase tracking-wider text-[#FDD935] mb-6 flex items-center gap-2">
              <HardDrive size={18} /> Format Support
            </h3>
            <div className="space-y-3">
              {formatSupport.map((f, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs">
                  <span className="font-bold text-white mb-1 sm:mb-0">{f.format}</span>
                  <span className="text-gray-400 font-medium">{f.support}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Support Table */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg font-bold uppercase tracking-wider text-[#FDD935] mb-6 flex items-center gap-2">
              <Monitor size={18} /> OS Compatibility
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3 font-semibold">Capability</th>
                    <th className="pb-3 font-semibold">Win</th>
                    <th className="pb-3 font-semibold">Linux</th>
                    <th className="pb-3 font-semibold">macOS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {platformSupport.map((row, i) => (
                    <tr key={i}>
                      <td className="py-3 font-medium text-white">{row.capability}</td>
                      <td className="py-3">{row.windows}</td>
                      <td className="py-3">{row.linux}</td>
                      <td className="py-3">{row.macos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FDD935]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">Build Firmware Without Friction.</h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base mb-10 font-normal">
            Available as part of Xoeris Development Programs and included in Xoeris Pro & Ultra subscriptions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-10 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_25px_rgba(253,217,53,0.35)]"
            >
              Get APEX License
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
