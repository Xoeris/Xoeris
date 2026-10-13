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
    { label: "UI Framework", value: "Avalonia 12.1 (FluentTheme, code-first views) on .NET 10" },
    { label: "Editor Engine", value: "HIDEEditorCore - native C++ / Direct2D / DirectWrite in NativeControlHost" },
    { label: "Agentic AI", value: "Sarah agent: Ollama, OpenAI-compatible APIs, local GGUF (LLamaSharp), MCP tools" },
    { label: "Themes & Styling", value: "Dark, Light, Deep Blue (switched live)" },
    { label: "Platforms", value: "Windows (primary); Linux and macOS pipelines in place" }
  ];

  const editorFeatures = [
    "Native C++ / Direct2D rendering with zero-overhead syntax coloring, gutter, minimap, and sticky scopes",
    "Indent guides, whitespace markers, and instant matching-bracket highlighting",
    "Multi-cursor editing, find & replace, refactoring helpers, code folding, split panes, and drag-to-reorder tabs",
    "Language Server Protocol (LSP) client for completion, hover, go to definition, and diagnostics",
    "Pre-packaged fonts (Clear Sans default) loaded directly by the native engine with format-on-save"
  ];

  const workspaceFeatures = [
    "Multi-select Explorer with drag-and-drop, rename, delete, and OS reveal",
    "Multi-root workspace support (.code-workspace files), recent projects, and session restore",
    "Workspace-wide symbol indexing and regex search with glob include/exclude filters",
    "Integrated Git source control with real-time status, staging, and branch commit tracking",
    "Integrated Terminal with multiple sessions, split panes (PowerShell, CMD, Git Bash, WSL)"
  ];

  const sarahAIFeatures = [
    "Agentic chat with tool use, reasoning effort slider, conversation history, and slash commands",
    "Bring your own model: Connect Ollama, any OpenAI-compatible endpoint, or local GGUF models",
    "Model Context Protocol (MCP) server support, customizable skills, and persistent file memories",
    "Whole-project awareness across every folder in multi-root workspaces without data leakage"
  ];

  const builtInViewers = [
    {
      name: "Real-Time Preview",
      desc: "Inline preview tab for web projects. Detects running services (e.g., localhost:5173 · node) with live URL address bar.",
      icon: Globe
    },
    {
      name: "Aurevia Web Browser",
      desc: "Tabbed web browser built right into the editor with incognito tabs, color-coded tab groups, and per-tab mute.",
      icon: Globe
    },
    {
      name: "Medialux Media Suite",
      desc: "High-resolution image and video playback with integrated video trimming and export powered by ffmpeg.",
      icon: Film
    },
    {
      name: "Document & Archive Suite",
      desc: "PDF, DOCX, and archive inspectors that open natively within the editor document viewport.",
      icon: FileText
    },
    {
      name: "Dualarity Text Similarity",
      desc: "Sentence-by-sentence document similarity analyzer comparing against reference documents or web sources.",
      icon: Sparkles
    }
  ];

  const installArtifacts = [
    { platform: "Windows", artifact: "Horizone IDE-Installer-win-x64.exe, win-arm64.exe", path: "%LOCALAPPDATA%\\Horizone IDE" },
    { platform: "Linux", artifact: "Horizone IDE-Installer-linux-<arch>, .deb, .tar.gz, AppImage", path: "~/.local/share/Horizone IDE" },
    { platform: "macOS", artifact: "Horizone IDE-Installer-osx-<arch>, Horizone IDE.app (.dmg)", path: "~/Applications/Horizone IDE.app" }
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
            {releaseMeta ? `Latest Release: ${releaseMeta.tagName}` : 'Built with C# and Avalonia 12 • .NET 10'}
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Horizone <span className="text-[#FDD935]">IDE.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white font-bold max-w-3xl leading-snug mb-4">
            A fast, native-feeling code editor and AI-assisted development suite. Yours to run, yours to own.
          </p>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-normal leading-relaxed mb-10">
            Pairs a custom native text-editing engine (C++ / Direct2D / DirectWrite) with an Avalonia 12 interface, shipped with Sarah agentic AI assistant.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-12">
            <a 
              href={downloadUrl}
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(253,217,53,0.4)] flex items-center gap-2 cursor-pointer border-none no-underline"
            >
              <Download size={16} /> 
              {loadingAsset ? 'Resolving Asset...' : `Download ${platformInfo.label}${fileSizeLabel} — Free`}
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

        {/* Live Code Console Mockup */}
        <FadeIn delay={150} className="w-full max-w-5xl mt-2">
          <div className="rounded-3xl border border-white/15 bg-black/60 backdrop-blur-3xl p-5 sm:p-7 text-left shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="text-xs font-mono text-gray-400 ml-3">Horizone IDE // HIDEEditorCore.cpp (Direct2D Native)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#FDD935]">
                <Bot size={14} /> Sarah AI Agent Running
              </div>
            </div>

            <pre className="font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto p-4 bg-black/40 rounded-xl leading-relaxed">
{`// HIDEEditorCore: Direct2D Hardware Rendering Loop
void NativeEditorSurface::RenderGutterAndMinimap(ID2D1RenderTarget* target) {
    target->DrawGlyphRun(origin, glyphRun, brushForeground, DWRITE_MEASURING_MODE_NATURAL);
    // Sticky scope headers & multi-root LSP diagnostics synchronized
    SarahAgent::SyncContext(activeWorkspace->GetWorkspaceFolders());
}`}
            </pre>
            <div className="flex justify-between items-center pt-3 text-[11px] text-gray-400 font-mono">
              <span>Avalonia 12.1 FluentTheme • .NET 10</span>
              <span className="text-[#FDD935]">Zero Telemetry Leakage • BYOM Enabled</span>
            </div>
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

      {/* Platform & Installation Targets */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10">
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-6 flex items-center gap-2">
            <Download size={16} /> Installer Artifacts & Paths
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-semibold">Platform</th>
                  <th className="pb-3 font-semibold">Package Artifact</th>
                  <th className="pb-3 font-semibold">Install Directory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {installArtifacts.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3.5 font-bold text-white">{row.platform}</td>
                    <td className="py-3.5 font-mono text-[#FDD935]">{row.artifact}</td>
                    <td className="py-3.5 font-mono text-gray-400">{row.path}</td>
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
              <Download size={16} /> Download for {platformInfo.label}{fileSizeLabel} — Free
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
