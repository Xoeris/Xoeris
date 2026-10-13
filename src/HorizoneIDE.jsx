import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Code2, Bot, Terminal, Globe, Film, FileText, 
  Settings, CheckCircle2, Download, ExternalLink, Cpu, Layers, 
  Sparkles, Monitor, HardDrive, ShieldCheck, Play, FolderTree, Loader2
} from 'lucide-react';
import SoftwareLayout from './components/SoftwareLayout';
import FadeIn from './components/FadeIn';
import { detectClientPlatform, fetchLatestRelease, matchBestAsset } from './utils/githubRelease';

export default function HorizoneIDE({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('editor');
  const [platformInfo, setPlatformInfo] = useState({ os: 'windows', arch: 'x64', label: 'Windows (x64)' });
  const [matchedAsset, setMatchedAsset] = useState(null);
  const [releaseMeta, setReleaseMeta] = useState(null);
  const [loadingAsset, setLoadingAsset] = useState(true);

  useEffect(() => {
    const detected = detectClientPlatform();
    setPlatformInfo(detected);

    let isMounted = true;
    fetchLatestRelease('Xoeris/Horizone-IDE').then(release => {
      if (!isMounted) return;
      if (release) {
        setReleaseMeta(release);
        const best = matchBestAsset(release.assets, detected);
        setMatchedAsset(best);
      }
      setLoadingAsset(false);
    });

    return () => { isMounted = false; };
  }, []);

  // Compute download URL with intelligent fallback
  const downloadUrl = matchedAsset?.url || 'https://github.com/Xoeris/Horizone-IDE/releases/latest';
  const downloadLabel = matchedAsset ? `${matchedAsset.name}` : `Download for ${platformInfo.label}`;
  const fileSizeLabel = matchedAsset?.size ? ` (${(matchedAsset.size / (1024 * 1024)).toFixed(1)} MB)` : '';

  const technicalArchitecture = [
    { label: "App Framework", value: "Built on XIME (Xoeris Interactive Modular Ecosystem)" },
    { label: "Desktop Shell", value: "Fluent Theme (Gold #FFC94A), custom-drawn chrome & dockable panels" },
    { label: "Native Engine", value: "HIDEEditorCore.dll (C++ / Direct2D / DirectWrite), 120 FPS GC-free" },
    { label: "Agentic AI", value: "Sarah: BYOM (Ollama, local GGUF via LLamaSharp, OpenAI-compatible APIs), MCP tools" },
    { label: "Mobile Companion", value: "Xoeris Horizone for Android (minSdk 24, targetSdk 36, Chaquopy Python)" },
    { label: "Supported Platforms", value: "Windows (x64/arm64), Linux (x64/arm64), macOS (Apple Silicon/Intel)" }
  ];

  const desktopPanels = [
    { name: "Editor Surface", desc: "High-performance text editor rendered by HIDEEditorCore (C++ / Direct2D / DirectWrite) with 120 FPS rendering." },
    { name: "Workspace Explorer", desc: "Multi-root project tree (.code-workspace), drag-and-drop file operations, Git status badges, and OS reveal." },
    { name: "Sarah (AI Assistant)", desc: "Agentic coding assistant: BYOM (Ollama, local GGUF via LLamaSharp, OpenAI APIs), MCP tools, and persistent memory." },
    { name: "Source Control (Git)", desc: "Integrated Git view: file staging, multi-root repository tracking, commit creation, and branch awareness." },
    { name: "Integrated Terminal", desc: "Multi-session terminal emulator with split panes and profile selection (PowerShell, CMD, Git Bash, WSL)." },
    { name: "Real-Time Preview", desc: "Web dev tab that automatically detects and inspects active local servers (e.g. localhost:5173 · node)." },
    { name: "Aurevia (Browser)", desc: "Tabbed web browser with incognito mode, named color-coded tab groups, and per-tab audio muting." },
    { name: "Medialux & Viewers", desc: "Media viewer/trimmer (LibVLCSharp), PDF viewer (PdfPig), DOCX viewer (Docnet.Core), and archive inspector." },
    { name: "Dualarity", desc: "Sentence-by-sentence document similarity analyser with scored match grids and summary export." },
    { name: "Settings & Keymaps", desc: "Visual settings manager, live theme switcher (Dark/Light/Deep Blue), and two-step keyboard chord remapper." }
  ];

  const editorFeatures = [
    "Native Direct2D rendering engine with syntax colouring, gutter, minimap, sticky scope headers, indent guides, whitespace markers and matching-bracket highlight",
    "Multi-cursor editing, find and replace, refactoring helpers, code folding, split editors, and drag-to-reorder tabs with preview and pinned tabs",
    "Language Server Protocol (LSP) client supporting code completion, hover tooltips, go-to-definition, code diagnostics, and multi-root workspaceFolders",
    "Configurable font family, size, tab width, word wrap, and format-on-save with bundled fonts (Clear Sans default) loaded directly without OS install",
    "Offscreen BGRA minimap thumbnail buffer composited directly into the editor margin at zero GC overhead"
  ];

  const workspaceFeatures = [
    "Explorer with multi-selection, drag-and-drop (move, or copy with Ctrl), rename, delete, copy/cut/paste, and reveal in OS file manager",
    "Multi-root workspaces (.code-workspace files, including launch from CLI), recent workspaces, and session restoration",
    "Workspace-wide symbol index and find-in-files with include/exclude glob filters",
    "Integrated Git status tracking that automatically follows the active file's repository folder",
    "Multi-session terminal emulator with split views and docking into either sidebar or bottom panel"
  ];

  const sarahAIFeatures = [
    "Agentic chat with tool execution, effort slider, chat history, attachments, and slash commands",
    "Bring your own model: Connect Ollama, any OpenAI-compatible endpoint, or local GGUF models in-process via LLamaSharp",
    "Model Context Protocol (MCP) server support, customizable skills, and persistent file memories configurable from Settings",
    "Whole-project awareness across every folder in a multi-root workspace without sending data to unauthorized endpoints"
  ];

  const builtInViewers = [
    {
      name: "Real-Time Preview",
      desc: "Inline live preview for web projects. Detects running services (e.g. localhost:5173 · node) with live URL address bar.",
      icon: Globe
    },
    {
      name: "Aurevia Web Browser",
      desc: "Tabbed web browser built right into the editor with incognito tabs, color-coded tab groups, and per-tab audio mute.",
      icon: Globe
    },
    {
      name: "Medialux Media Suite",
      desc: "High-resolution image and video player with video trimming and export powered by LibVLCSharp and ffmpeg.",
      icon: Film
    },
    {
      name: "Documents & Archives",
      desc: "PDF viewer (PdfPig), DOCX viewer (Docnet.Core), and archive inspectors that open natively within the editor tab viewport.",
      icon: FileText
    },
    {
      name: "Dualarity Text Similarity",
      desc: "Sentence-by-sentence document similarity analyzer comparing against reference documents or web sources with match grids.",
      icon: Sparkles
    }
  ];

  const platformCapabilities = [
    { cap: "Desktop UI & Chrome", win: "Fluent theme, custom decorations", linux: "Fluent theme, X11/Wayland", mac: "Fluent theme, macOS menu bar" },
    { cap: "Themes & Customisation", win: "Live Dark/Light/Deep Blue", linux: "Live Dark/Light/Deep Blue", mac: "Live Dark/Light/Deep Blue" },
    { cap: "Sarah AI (Remote / Ollama / MCP)", win: "Full support", linux: "Full support", mac: "Full support" },
    { cap: "Sarah AI (Local GGUF via LLamaSharp)", win: "CPU / DirectML", linux: "CPU", mac: "CPU / Metal" },
    { cap: "Native Editor (HIDEEditorCore)", win: "Direct2D / DirectWrite", linux: "Port in progress", mac: "Port in progress" },
    { cap: "Real-Time Preview & Aurevia", win: "WebView2", linux: "WebKitGTK", mac: "WKWebView" },
    { cap: "Medialux (LibVLCSharp)", win: "Bundled LibVLC", linux: "System libvlc", mac: "App bundle libvlc" },
    { cap: "Document Viewers (PDF / DOCX)", win: "PdfPig / Docnet.Core", linux: "PdfPig / Docnet.Core", mac: "PdfPig / Docnet.Core" }
  ];

  return (
    <SoftwareLayout
      title="Horizone IDE"
      subtitle="A fast, native-feeling code editor and AI-assisted development suite"
      onNavigate={onNavigate}
    >
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn className="max-w-4xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FDD935] uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-ping"></span>
            Status: 1.01.02 • Built on XIME (Xoeris Interactive Modular Ecosystem)
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Horizone <span className="text-[#FDD935]">IDE.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white font-bold max-w-3xl leading-snug mb-4">
            A fast, native-feeling code editor and AI-assisted development suite. Pair a custom C++ Direct2D editor engine with an agentic AI assistant and built-in developer tools, all under your control.
          </p>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-normal leading-relaxed mb-10">
            Yours to run, yours to own. Includes desktop suite for Windows, Linux, and macOS, plus companion Xoeris Horizone for Android.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-12">
            <a 
              href={downloadUrl}
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(253,217,53,0.4)] flex items-center gap-2 cursor-pointer border-none no-underline"
            >
              <Download size={16} /> 
              {loadingAsset ? 'Resolving Asset...' : `Download ${platformInfo.label}${fileSizeLabel} (Free)`}
            </a>
            <a 
              href={releaseMeta?.htmlUrl || "https://github.com/Xoeris/Horizone-IDE/releases"} 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2 no-underline"
            >
              All Assets ({releaseMeta?.assets?.length || 6}) <ExternalLink size={14} />
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Overview Technical Architecture */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-6">Technical Architecture</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalArchitecture.map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FDD935] mb-1">{item.label}</div>
                <div className="text-sm font-semibold text-white leading-snug">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabbed Feature Explorer */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Core Capabilities</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Crafted for Native Efficiency.</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'editor', label: 'Native Editor' },
            { id: 'workspace', label: 'Workspace & Terminal' },
            { id: 'sarah', label: 'Sarah AI Assistant' },
            { id: 'viewers', label: 'Built-in Viewers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeCategory === tab.id
                  ? 'bg-[#FDD935] text-black border-[#FDD935] shadow-[0_0_20px_rgba(253,217,53,0.3)]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Tab */}
        {activeCategory === 'editor' && (
          <div className="grid md:grid-cols-2 gap-6">
            {editorFeatures.map((feat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#FDD935]/10 flex items-center justify-center text-[#FDD935] shrink-0 mt-1">
                  <Code2 size={16} />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-medium">{feat}</p>
              </div>
            ))}
          </div>
        )}

        {/* Workspace Tab */}
        {activeCategory === 'workspace' && (
          <div className="grid md:grid-cols-2 gap-6">
            {workspaceFeatures.map((feat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#FDD935]/10 flex items-center justify-center text-[#FDD935] shrink-0 mt-1">
                  <Terminal size={16} />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-medium">{feat}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sarah Tab */}
        {activeCategory === 'sarah' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="text-[#FDD935]" size={32} />
              <div>
                <h3 className="text-2xl font-bold">Sarah Agentic Assistant</h3>
                <p className="text-xs text-gray-400">Bring Your Own Model: Ollama, local GGUF via LLamaSharp, or OpenAI endpoints</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {sarahAIFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300">
                  <CheckCircle2 size={16} className="text-[#FDD935] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viewers Tab */}
        {activeCategory === 'viewers' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builtInViewers.map((viewer, i) => (
              <div key={i} className="p-7 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FDD935]/10 flex items-center justify-center text-[#FDD935] mb-5">
                    <viewer.icon size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{viewer.name}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{viewer.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-[#FDD935] font-semibold">
                  <span>Built-in View</span>
                  <CheckCircle2 size={14} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Panels & Components Grid */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Modular Workspace</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Desktop Pages & Panels.</h2>
          <p className="text-gray-400 text-sm mt-3 font-normal">A complete development suite running on XIME with customizable docks and native interop.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {desktopPanels.map((panel, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FDD935]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#FDD935]"></div>
                  <h4 className="text-base font-bold text-white">{panel.name}</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">{panel.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works Architecture Diagram */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-black/60 border border-white/10 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-xs font-mono text-[#FDD935] uppercase tracking-wider mb-4">
            <Cpu size={14} /> System Architecture & Interop
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mb-4">How Horizone IDE Works.</h3>
          <p className="text-gray-300 text-sm max-w-2xl mb-10 leading-relaxed font-normal">
            Horizone IDE pairs a fast, modular desktop shell on XIME with a custom native text rendering engine, zero GC latency, and safe interop.
          </p>

          {/* Modern Visual Architecture Flow */}
          <div className="space-y-4 mb-8">
            {/* Top Tier: Desktop UI Layer */}
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-[#FDD935]/30 relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#FDD935] flex items-center gap-2">
                  <Monitor size={14} /> Desktop UI Layer (XIME)
                </span>
                <span className="text-[11px] font-mono text-gray-400">Fluent Theme • Gold #FFC94A • Compiled Bindings</span>
              </div>
              <p className="text-xs text-gray-300 font-medium">
                Custom Drawn Chrome • Dockable Panels • Sidebars • Multi-Tab Workspace • Searchable Settings UI • File Trees
              </p>
            </div>

            {/* Middle & Lower Tiers: 2-Column Split */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Native Control Interop */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Code2 size={14} className="text-[#FDD935]" /> Native Control Interop
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">Native Surface</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-300 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FDD935]"></span>
                      HIDEEditorCore.dll (C++ / Direct2D / DirectWrite)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FDD935]"></span>
                      Embedded Web Engine (WebView2 / WebKitGTK / WKWebView)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FDD935]"></span>
                      Medialux (LibVLCSharp & ffmpeg runtime)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Managed Services */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Bot size={14} className="text-[#FDD935]" /> Managed Services
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">CommunityToolkit.Mvvm</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-300 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FDD935]"></span>
                      Sarah Agent (LLamaSharp in-process / Ollama / OpenAI)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FDD935]"></span>
                      LSP Client (Language Server Protocol daemons)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FDD935]"></span>
                      Git Backend & Terminal Host (PTY emulation)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[#FDD935] font-bold block mb-1">120 FPS Rendering</span>
              <span className="text-gray-400">Direct2D / DirectWrite canvas detached from managed garbage collection.</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[#FDD935] font-bold block mb-1">LSP Lifecycle</span>
              <span className="text-gray-400">Multi-root language server daemons communicating via JSON-RPC standard I/O.</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[#FDD935] font-bold block mb-1">Live Endpoint Discovery</span>
              <span className="text-gray-400">Real-Time Preview inspects active local network endpoints and localhost servers.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Android Companion App Card */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-xs font-mono text-[#FDD935] mb-3">
              Companion App • com.xoeris.android.app.horizone
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2">
              Xoeris Horizone for Android.
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
              Mobile project browser and viewport editor with companion workspace sync, Chaquopy Python runtime, and terminal integration across ARM64, ARMv7a, and x86 architectures.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <a
              href="https://github.com/Xoeris/Horizone-IDE"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/20 transition-all flex items-center gap-2 no-underline"
            >
              Android Companion Info <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Platform Support Matrix */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10">
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-6 flex items-center gap-2">
            <Layers size={16} /> Platform Support Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-semibold">Capability</th>
                  <th className="pb-3 font-semibold">Windows</th>
                  <th className="pb-3 font-semibold">Linux</th>
                  <th className="pb-3 font-semibold">macOS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {platformCapabilities.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3.5 font-bold text-white">{row.cap}</td>
                    <td className="py-3.5 text-gray-300">{row.win}</td>
                    <td className="py-3.5 text-gray-300">{row.linux}</td>
                    <td className="py-3.5 text-gray-300">{row.mac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#FDD935]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-[#FDD935] text-[11px] font-mono uppercase tracking-widest mb-4">
            100% Free • No Pro Subscription Required
          </span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">Own Your Development Environment.</h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base mb-10 font-normal">
            Horizone IDE is completely free for Windows, Linux, and macOS. Native C++ speed, Sarah AI assistance, and zero vendor lock-in.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href={downloadUrl}
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_25px_rgba(253,217,53,0.35)] flex items-center gap-2 no-underline"
            >
              <Download size={16} /> Download for {platformInfo.label}{fileSizeLabel} (Free)
            </a>
            <a 
              href={releaseMeta?.htmlUrl || "https://github.com/Xoeris/Horizone-IDE/releases"}
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all cursor-pointer no-underline flex items-center gap-2"
            >
              View GitHub Releases <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>
    </SoftwareLayout>
  );
}
