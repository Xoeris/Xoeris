import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Music, CheckCircle2, Download, ExternalLink, 
  Layers, HardDrive, Smartphone, Radio, Sliders, Volume2, 
  FolderTree, Search, Sparkles, Monitor, Shuffle, ShieldCheck
} from 'lucide-react';
import SoftwareLayout from './components/SoftwareLayout';
import FadeIn from './components/FadeIn';
import { detectClientPlatform, fetchLatestRelease, matchBestAsset } from './utils/githubRelease';

export default function Musify({ onNavigate }) {
  const [platformInfo, setPlatformInfo] = useState({ os: 'windows', arch: 'x64', label: 'Windows (x64)' });
  const [matchedAsset, setMatchedAsset] = useState(null);
  const [releaseMeta, setReleaseMeta] = useState(null);
  const [loadingAsset, setLoadingAsset] = useState(true);

  useEffect(() => {
    const detected = detectClientPlatform();
    setPlatformInfo(detected);

    let isMounted = true;
    fetchLatestRelease('Xoeris/Musify').then(release => {
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

  const downloadUrl = matchedAsset?.url || 'https://github.com/Xoeris/Musify/releases/latest';
  const downloadLabel = matchedAsset ? `${matchedAsset.name}` : `Download for ${platformInfo.label}`;
  const fileSizeLabel = matchedAsset?.size ? ` (${(matchedAsset.size / (1024 * 1024)).toFixed(1)} MB)` : '';

  const desktopPanels = [
    {
      title: "Home (Overview)",
      desc: "Recently played tracks, recommended mixes, quick library statistics, and instant playback resume.",
      icon: Radio,
      badge: "Dashboard"
    },
    {
      title: "Library Browser",
      desc: "High-performance track collection browser with fast sorting and grouping by Title, Artist, Album, Genre, and Year.",
      icon: FolderTree,
      badge: "Collection"
    },
    {
      title: "Playlists (.xmpx)",
      desc: "Custom playlist manager: create, reorder, and import or export .xmpx playlists with full mobile app parity.",
      icon: Layers,
      badge: "Cross-Platform"
    },
    {
      title: "Now Playing View",
      desc: "Immersive player view with album artwork, real-time waveform progress seeker, queue drawer, and volume controls.",
      icon: Music,
      badge: "Waveform Seeker"
    },
    {
      title: "Instant Search",
      desc: "Multi-field library search querying across titles, artists, albums, and directory folder paths with zero latency.",
      icon: Search,
      badge: "Indexed Query"
    },
    {
      title: "Audio Tuning & Settings",
      desc: "Crossfade duration, smart gain normalization, 200% volume boost, watched folders, and system tray preferences.",
      icon: Sliders,
      badge: "DSP Tuning"
    }
  ];

  const audioEngineSpecs = [
    {
      title: "Bit-Perfect LibVLC Core",
      desc: "Hardware-accelerated playback with DirectSound, WASAPI, PulseAudio, and CoreAudio decoders.",
      badge: "Audiophile Grade"
    },
    {
      title: "Stripped Overhead Footprint",
      desc: "Over 500 unused video and disc modules removed, halving memory usage and delivering instant launch.",
      badge: "Low RAM Footprint"
    },
    {
      title: "Dual-Lane Crossfading",
      desc: "CrossfadeLane modulates two concurrent LibVLC audio streams across 1 to 10 seconds for seamless gapless transitions.",
      badge: "Gapless Flow"
    },
    {
      title: "Smart Volume Normalization",
      desc: "Automatic gain staging with volume expansion up to 200%, matching desktop and mobile listening levels.",
      badge: "200% Boost"
    },
    {
      title: "Thread-Safe SQLite Store",
      desc: "Single DbContext gated through asynchronous semaphores prevents database lockups during background scans.",
      badge: "EF Core / SQLite"
    },
    {
      title: "Native OS Media Controls",
      desc: "Full integration with Windows SMTC, Linux MPRIS v2 (D-Bus), and macOS Now Playing media sessions.",
      badge: "SMTC / MPRIS"
    }
  ];

  const supportedFormats = [
    "MP3", "FLAC", "AAC", "M4A", "OGG", "Opus", "WAV", "ALAC", "AIFF", "WMA"
  ];

  const platformCapabilities = [
    { cap: "Desktop UI & Themes", win: "Fluent theme, custom decorations", linux: "Fluent theme, X11/Wayland", mac: "Fluent theme, macOS menu bar" },
    { cap: "Audio Core (LibVLC)", win: "Bundled audio-only LibVLC", linux: "System libvlc", mac: "App bundle libvlc" },
    { cap: "System Media Controls", win: "SMTC (WinRT)", linux: "MPRIS (D-Bus)", mac: "Now Playing" },
    { cap: "Crossfade & Normalization", win: "Full support (1-10s)", linux: "Full support (1-10s)", mac: "Full support (1-10s)" },
    { cap: "System Tray & Autostart", win: "Full support", linux: "Full support", mac: "Full support" },
    { cap: ".xmpx Playlist Sync", win: "Native parity", linux: "Native parity", mac: "Native parity" }
  ];

  const configPaths = [
    { label: "Settings & Preferences", path: "%LOCALAPPDATA%\\Musify\\settings.json" },
    { label: "Music Library Database", path: "%LOCALAPPDATA%\\Musify\\musify.db" },
    { label: "Playlist Archives", path: "User-chosen or exported as .xmpx" },
    { label: "Playback Logs", path: "%LOCALAPPDATA%\\Musify\\logs\\" }
  ];

  return (
    <SoftwareLayout
      title="Musify"
      subtitle="A fast, native-feeling music player and library suite"
      onNavigate={onNavigate}
    >
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn className="max-w-4xl flex flex-col items-center">
          <img 
            src="/musify_logo_icon.png" 
            alt="Musify" 
            className="w-20 h-20 mb-6 object-contain drop-shadow-[0_0_25px_rgba(253,217,53,0.35)]" 
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FDD935] uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-ping"></span>
            Status: 1.01.01 • Built on XIME (Xoeris Interactive Modular Ecosystem)
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Musify <span className="text-[#FDD935]">Audio.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white font-bold max-w-3xl leading-snug mb-4">
            A fast, native-feeling music player and library suite: audiophile playback, seamless phone-to-desktop sync, and comprehensive audio management from one lightweight app.
          </p>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-normal leading-relaxed mb-10">
            Yours to run, yours to own. Free for Windows, Linux, and macOS, plus companion Xoeris Musify for Android with .xmpx playlist parity.
          </p>

          <div className="flex flex-wrap items-center gap-4 justify-center mb-12">
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
              href="https://github.com/Xoeris/Musify" 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2 no-underline"
            >
              GitHub Repository <ExternalLink size={14} />
            </a>
            <a 
              href={releaseMeta?.htmlUrl || "https://github.com/Xoeris/Musify/releases"} 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2 no-underline"
            >
              All Assets ({releaseMeta?.assets?.length || 6}) <ExternalLink size={14} />
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Audio Engine Highlights */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-6">
            <Volume2 size={16} />
            <span>Audio Architecture Highlights</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioEngineSpecs.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/20 text-[10px] font-bold text-[#FDD935] uppercase tracking-wider mb-3">
                    {item.badge}
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop Pages & Components Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Desktop Suite</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Pages and Workstation Panels.</h2>
          <p className="text-sm text-gray-400 mt-4">
            Structured for immediate keyboard access, low latency rendering, and deep library organization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {desktopPanels.map((panel, i) => {
            const Icon = panel.icon;
            return (
              <FadeIn key={i} delay={i * 80}>
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FDD935]/50 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FDD935]/10 border border-[#FDD935]/20 flex items-center justify-center text-[#FDD935] mb-6 group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#FDD935] mb-1">{panel.badge}</div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3 text-white group-hover:text-[#FDD935] transition-colors">
                      {panel.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm font-normal">{panel.desc}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Format Support & Android Companion */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Formats */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-4">Universal Codecs</div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">Lossless & Lossy Format Support.</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 font-normal">
                Direct hardware stream decoding through LibVLC core handles all popular digital audio formats without external transcoding.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {supportedFormats.map(fmt => (
                  <span key={fmt} className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono font-bold text-white">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-semibold">
              <span>Automatic Tag & Cover Art Caching</span>
              <CheckCircle2 size={16} className="text-[#FDD935]" />
            </div>
          </div>

          {/* Android Companion */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-4">
                <Smartphone size={16} />
                <span>Mobile Ecosystem</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">Xoeris Musify for Android.</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 font-normal">
                Companion mobile app with background audio service, notification controls, 200% volume boost with normalization, and full .xmpx playlist import/export parity.
              </p>
              <div className="space-y-2 text-xs text-gray-300 font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between">
                  <span>Android Targets:</span>
                  <span className="text-white font-bold">minSdk 24 • targetSdk 36</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between">
                  <span>Architectures:</span>
                  <span className="text-white font-bold">arm64-v8a, armeabi-v7a, x86, x86_64</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-semibold">
              <span>Zero-Friction Playlist Transfer</span>
              <CheckCircle2 size={16} className="text-[#FDD935]" />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Support Matrix */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Compatibility</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Platform Support Matrix.</h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[#FDD935] uppercase text-[11px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="py-4 px-6 font-bold">Capability</th>
                <th className="py-4 px-6 font-bold">Windows</th>
                <th className="py-4 px-6 font-bold">Linux</th>
                <th className="py-4 px-6 font-bold">macOS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 font-normal">
              {platformCapabilities.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#FDD935] shrink-0" />
                    {row.cap}
                  </td>
                  <td className="py-4 px-6">{row.win}</td>
                  <td className="py-4 px-6">{row.linux}</td>
                  <td className="py-4 px-6">{row.mac}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Configuration & Data Paths */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-6">Configuration and Data</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {configPaths.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-xs font-bold text-[#FDD935] mb-1">{item.label}</div>
                <div className="text-xs font-mono text-gray-300 break-all">{item.path}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Download CTA Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#FDD935]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">Ready to Experience Musify?</h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base mb-10 font-normal">
            Lightweight, high-fidelity, and completely free to install on your desktop or Android device.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href={downloadUrl}
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_25px_rgba(253,217,53,0.35)] no-underline flex items-center gap-2"
            >
              <Download size={16} /> 
              {loadingAsset ? 'Resolving Asset...' : `Download ${platformInfo.label} (Free)`}
            </a>
            <a 
              href="https://github.com/Xoeris/Musify"
              target="_blank"
              rel="noreferrer"
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all cursor-pointer no-underline flex items-center gap-2"
            >
              GitHub Repository <ExternalLink size={14} />
            </a>
            <a 
              href={releaseMeta?.htmlUrl || "https://github.com/Xoeris/Musify/releases"}
              target="_blank"
              rel="noreferrer"
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all cursor-pointer no-underline"
            >
              Explore Releases
            </a>
          </div>
        </div>
      </section>
    </SoftwareLayout>
  );
}
