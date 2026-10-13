import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Smile, Smartphone, Eye, Clock, Bell, 
  Brain, ShieldCheck, CheckCircle2, ExternalLink, Layers, 
  Activity, BookOpen, Sparkles, Download, Loader2
} from 'lucide-react';
import SoftwareLayout from './components/SoftwareLayout';
import FadeIn from './components/FadeIn';
import { detectClientPlatform, fetchLatestRelease, matchBestAsset } from './utils/githubRelease';

export default function MOVA({ onNavigate }) {
  const [platformInfo, setPlatformInfo] = useState({ os: 'android', arch: 'arm64', label: 'Android' });
  const [matchedAsset, setMatchedAsset] = useState(null);
  const [releaseMeta, setReleaseMeta] = useState(null);
  const [loadingAsset, setLoadingAsset] = useState(true);

  useEffect(() => {
    const detected = detectClientPlatform();
    setPlatformInfo(detected);

    let isMounted = true;
    fetchLatestRelease('Xoeris/MOVA').then(release => {
      if (!isMounted) return;
      if (release) {
        setReleaseMeta(release);
        // Specifically look for Android APK asset
        const apkAsset = matchBestAsset(release.assets, { os: 'android', arch: 'arm64' });
        setMatchedAsset(apkAsset);
      }
      setLoadingAsset(false);
    });

    return () => { isMounted = false; };
  }, []);

  const downloadUrl = matchedAsset?.url || 'https://github.com/Xoeris/MOVA/releases/latest';
  const fileSizeLabel = matchedAsset?.size ? ` (${(matchedAsset.size / (1024 * 1024)).toFixed(1)} MB)` : '';

  const coreFeatures = [
    {
      title: "Mood Face Recognition",
      desc: "Real-time on-device facial expression analysis run upon opening the application, classifying affective state before any task list appears.",
      icon: Smile,
      badge: "On-Device ML"
    },
    {
      title: "Adaptive Visual Feedback System",
      desc: "Replaces toxic streak trackers, scores, and gamified pressure with a gentle, non-punitive UI that adapts tone and granularity to emotional state.",
      icon: Eye,
      badge: "Affective Computing"
    },
    {
      title: "Daily Time Recognition",
      desc: "Segments the day into contextual sessions (morning, focus, wind-down) to counter time blindness and calibrate actionable suggestions.",
      icon: Clock,
      badge: "Circadian Context"
    },
    {
      title: "Smart Mood-Responsive Reminders",
      desc: "WorkManager and AlarmManager notifications timed to optimal emotional windows rather than rigid calendar interruptions.",
      icon: Bell,
      badge: "Intelligent Scheduling"
    }
  ];

  const theoreticalPillars = [
    {
      title: "Barkley's Executive Function Model",
      desc: "Addresses ADHD as a deficit in behavioral inhibition and non-verbal working memory that causes time blindness."
    },
    {
      title: "Short-Term Mood Repair (Sirois & Pychyl)",
      desc: "Reframes procrastination as an emotional regulation strategy to escape task anxiety, not a failure of willpower."
    },
    {
      title: "Temporal Motivation Theory (TMT)",
      desc: "Calibrates Expectancy, Value, Impulsiveness, and Delay to generate immediate emotional safety for task initiation."
    },
    {
      title: "Non-Gamified Neurodivergent UI",
      desc: "Avoids shame-inducing streak counters and punitive abandonment loops documented in adult ADHD studies."
    }
  ];

  const techStack = [
    { label: "Core Language", value: "Java 100% (Native Android SDK)" },
    { label: "UI Framework", value: "XIME Custom Android UI/Core Library (xime.ui.layout.*)" },
    { label: "Face Detection", value: "Google ML Kit Face Detection API (On-Device)" },
    { label: "Mood Classifier", value: "5-Mood Calibrated Temporal Landmark & Pose Fusion" },
    { label: "Background Services", value: "Android WorkManager & AlarmManager" },
    { label: "Data Architecture", value: "Unidirectional Data Flow (UDF), ViewModel / LiveData" }
  ];

  const ximeModules = [
    { name: "XIME.Core", desc: "Foundational utilities, logging, and shared mobile infrastructure" },
    { name: "XIME.UI", desc: "Custom layouts, views, dialogs, and widgets replacing stock widgets" },
    { name: "XIME.Animation", desc: "Motion and transition primitives built on dynamicanimation" },
    { name: "XIME.Graphics", desc: "Custom drawing, shaders, and LegacyBlur effects" },
    { name: "XIME.Persistence", desc: "Thread-safe data persistence layers built on Room" }
  ];

  return (
    <SoftwareLayout
      title="MOVA"
      subtitle="Mood Face Recognition Android App for Individuals with ADHD & Procrastination"
      onNavigate={onNavigate}
    >
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <FadeIn className="max-w-4xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FDD935] uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-ping"></span>
            Status: Pre-Alpha Test • Native Android
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="https://github.com/user-attachments/assets/9ce832d3-28c5-49de-9165-d31900dae91f" 
              alt="MOVA Icon" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl shadow-xl"
            />
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              MOVA<span className="text-[#FDD935]">.</span>
            </h1>
          </div>

          <h2 className="text-xl sm:text-2xl text-white font-bold max-w-3xl leading-snug mb-4">
            Mood Face Recognition Android App for Individuals with ADHD & Procrastination
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl font-normal leading-relaxed mb-10">
            A native Android application that uses real-time, on-device facial expression analysis to detect affective state, delivering an adaptive visual feedback system designed to reduce task-initiation friction. Grounded in peer-reviewed ADHD and affective computing research.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-12">
            <a 
              href={downloadUrl}
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(253,217,53,0.4)] flex items-center gap-2 cursor-pointer border-none no-underline"
            >
              <Download size={16} /> 
              {loadingAsset ? 'Resolving APK...' : `Download APK${fileSizeLabel} — Free`}
            </a>
            <a 
              href={releaseMeta?.htmlUrl || "https://github.com/Xoeris/MOVA/releases"} 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-2 no-underline"
            >
              All Releases ({releaseMeta?.tagName || 'v1.00-Alpha'}) <ExternalLink size={14} />
            </a>
          </div>
        </FadeIn>

        {/* Official Banner Mockup */}
        <FadeIn delay={150} className="w-full max-w-5xl mt-2">
          <div className="rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-black/60 relative group">
            <img 
              src="https://github.com/user-attachments/assets/7e020fe6-9352-4e52-a202-03461f20cd59" 
              alt="Xoeris MOVA Banner" 
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-xs text-gray-300 font-mono">
              <span>MOVA // Mood-Aware Mobile Executive Scaffold</span>
              <span className="text-[#FDD935] font-bold">100% On-Device Privacy Guaranteed</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Core Paradigm: Executive Function & Mood Repair */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Scientific Foundation</div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mb-6">
            Procrastination is an Emotional Regulation Problem, Not a Calendar Failure.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300 text-sm leading-relaxed">
            <p>
              Standard productivity apps treat procrastination as a lack of scheduling or discipline, enforcing streaks that cause guilt and abandonment upon a single failure. Barkley’s behavioral inhibition model explains that ADHD deficits in non-verbal working memory cause severe <strong>time blindness</strong>.
            </p>
            <p>
              Sirois & Pychyl prove that task delay is an attempt at <strong>immediate mood repair</strong> to escape anxiety or fear of failure. MOVA short-circuits this avoidance loop by providing objective, biofeedback visibility into the user's emotional state before task initiation.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">Adaptive Intervention</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Features Engineered for Neurodiversity.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {coreFeatures.map((feat, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FDD935]/50 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col justify-between group">
                <div>
                  <div className="inline-block px-3 py-1 rounded-lg bg-[#FDD935]/10 border border-[#FDD935]/20 text-[10px] font-bold text-[#FDD935] uppercase tracking-wider mb-6">
                    {feat.badge}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-[#FDD935] transition-colors">{feat.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm font-normal">{feat.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span>Non-Punitive Interface</span>
                  <CheckCircle2 size={16} className="text-[#FDD935]" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* On-Device ML Pipeline Flow */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FDD935] mb-3">On-Device Privacy</div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Zero-Server Vision Pipeline.</h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/50 p-6 sm:p-10 font-mono text-xs sm:text-sm text-gray-300 backdrop-blur-2xl overflow-x-auto leading-relaxed">
{`User opens app ──▶ CameraX Frame Capture
                         │
                         ▼
             Google ML Kit Face Detection (Landmarks + Head Pose + Eye Openness)
                         │
                         ▼
             Heuristic Multi-Signal Fusion (Smile trend, blink fatigue, gaze volatility)
                         │
                         ▼
             5-Mood Calibrated Distribution ──▶ Adaptive UI & Task Granularity Scaffolding`}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          All image analysis executes completely on-device. Zero video frames or face biometric data are ever sent over network interfaces.
        </p>
      </section>

      {/* Tech Stack & XIME Library */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Tech Stack */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg font-bold uppercase tracking-wider text-[#FDD935] mb-6 flex items-center gap-2">
              <Smartphone size={18} /> Android Tech Stack
            </h3>
            <div className="space-y-3">
              {techStack.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs">
                  <span className="font-bold text-white mb-1 sm:mb-0">{item.label}</span>
                  <span className="text-gray-400 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* XIME Library Modules */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg font-bold uppercase tracking-wider text-[#FDD935] mb-6 flex items-center gap-2">
              <Layers size={18} /> Powered by XIME Library
            </h3>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              MOVA is built on XIME, a modular Android UI/Core library by Xoeris that replaces stock widgets with high-performance components.
            </p>
            <div className="space-y-3">
              {ximeModules.map((mod, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs">
                  <div className="font-mono text-[#FDD935] font-bold mb-1">{mod.name}</div>
                  <div className="text-gray-400">{mod.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FDD935]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-[#FDD935] text-[11px] font-mono uppercase tracking-widest mb-4">
            100% Free • Open Testing
          </span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">Overcome Task Initiation Friction.</h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base mb-10 font-normal">
            MOVA is free to download and test on any Android device. Experience gentle, mood-responsive executive scaffolding without subscription walls.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href={downloadUrl}
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-4 bg-[#FDD935] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_25px_rgba(253,217,53,0.35)] flex items-center gap-2 no-underline"
            >
              <Download size={16} /> Download APK{fileSizeLabel} — Free
            </a>
            <a 
              href={releaseMeta?.htmlUrl || "https://github.com/Xoeris/MOVA/releases"}
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all cursor-pointer no-underline flex items-center gap-2"
            >
              GitHub Releases <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>
    </SoftwareLayout>
  );
}
