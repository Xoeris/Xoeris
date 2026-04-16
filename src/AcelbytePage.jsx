import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Globe, Cpu, Terminal, Shield, Zap, Play, Pause } from 'lucide-react';
import FadeIn from './components/FadeIn';

// Futuristic CyberGlassMorphism Yellow Tech Palette
const colors = {
  bg: '#050505',
  primary: '#FDD935', // Neon Cyber Yellow
  secondary: '#F59E0B', // Amber
  accent: '#FEF08A', // Light Yellow Glow
  text: '#ffffff',
  textMuted: '#a1a1aa',
  glassBg: 'rgba(253, 217, 53, 0.03)',
  glassBorder: 'rgba(253, 217, 53, 0.2)'
};

const ProjectCard = ({ project, onClick }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnded = () => {
    if (project.videos && project.videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % project.videos.length);
    }
  };

  const currentVideoSrc = project.videos ? project.videos[currentVideoIndex] : project.video;

  return (
    <div
      onClick={() => onClick(project)}
      className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-black cursor-pointer hover:border-[#FDD935]/50 hover:shadow-[0_0_30px_rgba(253,217,53,0.15)] transition-all duration-[400ms] ease-hyper hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
      {currentVideoSrc ? (
        <video
          src={currentVideoSrc}
          poster={project.image}
          autoPlay
          loop={!project.videos || project.videos.length === 1}
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
      ) : project.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${project.image}')` }}
        ></div>
      ) : (
        <div className="absolute inset-0 bg-black"></div>
      )}
      <div
        className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{ color: project.color }}
      >
        {project.category}
      </div>
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h4 className="text-2xl font-black mb-2 text-white">{project.title}</h4>
        <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
          {project.description}
        </p>
      </div>
    </div>
  );
};

export default function AcelbytePage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVideoIndex, setModalVideoIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio() : null);

  const statusBlades = [
    {
      id: 'faith',
      label: 'With Faith',
      color: '#FDD935',
      width: 'w-64',
      animation: 'group-hover:-translate-y-6',
      shadowColor: '253,217,53',
      delay: '',
      barWidth: '85%',
      trackUrl: '/with-faith.mp3'
    },
    {
      id: 'holdon',
      label: 'Hold On',
      color: '#F59E0B',
      width: 'w-72',
      animation: 'group-hover:scale-105',
      shadowColor: '245,158,11',
      delay: 'delay-75',
      barWidth: '60%',
      trackUrl: '/hold-on.mp3'
    },
    {
      id: 'soon',
      label: 'Coming Soon...',
      color: '#FEF08A',
      width: 'w-64',
      animation: 'group-hover:translate-y-6',
      shadowColor: '254,240,138',
      delay: 'delay-150',
      barWidth: '95%',
      trackUrl: ''
    }
  ];

  const toggleTrack = (blade) => {
    if (!audioRef.current || !blade.trackUrl) return;

    if (currentTrack === blade.id) {
      audioRef.current.pause();
      setCurrentTrack(null);
      setTrackProgress(0);
    } else {
      audioRef.current.src = blade.trackUrl;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
      setCurrentTrack(blade.id);
      setTrackProgress(0);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setTrackProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setCurrentTrack(null);
      setTrackProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: "Personal VFXs",
      category: "VFX",
      description: "A collection of high-octane 3D motion design pieces exploring concepts of digital rebirth and futuristic aesthetics. Utilizing advanced particle simulations and volumetric lighting.",
      videos: ["personal-vfx-scenes.mp4"],
      color: "#FDD935",
      stack: ["Houdini", "Redshift", "After Effects"]
    },
    {
      id: 2,
      title: "Cyber Core",
      category: "Development",
      description: "An immersive WebGL experience built with React Three Fiber. Features real-time physics, shader effects, and audio-reactive visuals running smoothly in the browser.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
      color: "#F59E0B",
      stack: ["React", "Three.js", "GLSL"]
    },
    {
      id: 3,
      title: "Urban Decay",
      category: "Photography",
      description: "A street photography series capturing the raw, unfiltered essence of Jakarta's urban landscape. Focusing on the interplay of light, shadow, and architectural geometry.",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2622&auto=format&fit=crop",
      color: "#FEF08A",
      stack: ["Sony A7III", "35mm f/1.4", "Lightroom"]
    },
    {
      id: 4,
      title: "Synthwave Dreams",
      category: "Music",
      description: "An original 5-track EP blending retro 80s synths with modern trap beats. Sound design focused on analog warmth and futuristic atmosphere.",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2670&auto=format&fit=crop",
      color: "#FDD935",
      stack: ["Ableton Live", "Serum", "Analog Synths"]
    },
    {
      id: 5,
      title: "UMN's Maxima 2024 VFXs",
      category: "VFX",
      description: "Official VFX and motion design work for UMN Maxima 2024. Featuring stylized color grading and experimental editing techniques to convey a powerful event narrative.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
      video: "/maxima-2024-after-movie-vfx-scenes.mp4",
      color: "#F59E0B",
      stack: ["DaVinci Resolve", "Premiere Pro", "Arri Alexa"]
    },
    {
      id: 6,
      title: "System Override",
      category: "Experimental",
      description: "A generative art installation powered by AI algorithms. The system evolves in real-time based on environmental data inputs, creating unique visual patterns.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
      color: "#FEF08A",
      stack: ["TouchDesigner", "Python", "Stable Diffusion"]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-[#FDD935] selection:text-black relative z-0 overflow-x-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>

      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-[-2] bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 mask-image-radial-gradient"></div>

      {/* Shared Animated Background Blobs (Yellow Tech Theme) */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen">
        <div className="blob blob-1" style={{ backgroundColor: colors.primary }}></div>
        <div className="blob blob-2" style={{ backgroundColor: colors.secondary }}></div>
        <div className="blob blob-3" style={{ backgroundColor: colors.accent }}></div>
        {/* Heavy Glass overlay for CyberGlassMorphism */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[100px]"></div>
      </div>

      <div className="animate-fade-in relative z-10">
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 shadow-[0_10px_30px_rgba(253,217,53,0.05)] backdrop-blur-2xl bg-black/50 border-b border-[#FDD935]/20' : 'py-6 bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
            <a href="#" className="flex items-center group">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 overflow-hidden">
                <img src="/acelbyte-logo.png" alt="Acelbyte Logo" className="w-full h-full object-cover" />
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all duration-300 ease-hyper-bounce uppercase tracking-wider active:scale-95">About</a>
              <a href="#works" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all duration-300 ease-hyper-bounce uppercase tracking-wider active:scale-95">Works</a>
              <a href="#contact" className="text-sm font-bold text-gray-300 hover:text-[#FDD935] hover:drop-shadow-[0_0_8px_rgba(253,217,53,0.8)] transition-all duration-300 ease-hyper-bounce uppercase tracking-wider active:scale-95">Contact</a>

              <div className="w-px h-6 bg-[#FDD935]/20"></div>

              <div className="flex items-center gap-5">
                <a href="https://loomastudio.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('looma'); }} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors duration-300 ease-hyper">
                  <img src="/looma-studio-logo.png" alt="Looma" className="w-3.5 h-3.5 object-contain" /> LOOMA
                </a>
                <a href="https://xoeris.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('xoeris'); }} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors duration-300 ease-hyper">
                  <img src="/xoeris-logo.png" alt="Xoeris" className="w-3.5 h-3.5 object-contain" /> XOERIS
                </a>
                <a href="https://tartaruga.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('tartaruga'); }} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors duration-300 ease-hyper">
                  <img src="/tartaruga-logo.png" alt="Tartaruga" className="w-3.5 h-3.5 object-contain" /> TARTARUGA
                </a>
              </div>
              <a href="#works" className="px-6 py-2.5 text-sm font-black uppercase tracking-wider rounded-lg transition-all duration-500 ease-hyper hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(253,217,53,0.4)] hover:shadow-[0_0_30px_rgba(253,217,53,0.7)]" style={{ backgroundColor: colors.primary, color: '#000' }}>
                View Portfolio
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-[#FDD935] transition-transform duration-300 ease-hyper-bounce active:scale-90" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-[#FDD935]/20 shadow-[0_20px_40px_rgba(253,217,53,0.1)] py-6 flex flex-col items-center gap-6 text-white">
              <a href="#about" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#works" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Works</a>
              <a href="#contact" className="text-lg font-bold text-gray-300 hover:text-[#FDD935] uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <div className="w-1/2 h-px bg-[#FDD935]/20 my-2"></div>
              <a href="#looma" onClick={(e) => { e.preventDefault(); onNavigate('looma'); setMobileMenuOpen(false); }} className="text-sm font-bold text-gray-400 hover:text-white py-2 flex items-center gap-2">
                <img src="/looma-studio-logo.png" alt="Looma" className="w-4 h-4 object-contain" /> LOOMA
              </a>
              <a href="https://xoeris.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('xoeris'); setMobileMenuOpen(false); }} className="text-sm font-bold text-gray-400 hover:text-white py-2 flex items-center gap-2">
                <img src="/xoeris-logo.png" alt="Xoeris" className="w-4 h-4 object-contain" /> XOERIS
              </a>
              <a href="https://tartaruga.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('tartaruga'); setMobileMenuOpen(false); }} className="text-sm font-bold text-gray-400 hover:text-white py-2 flex items-center gap-2">
                <img src="/tartaruga-logo.png" alt="Tartaruga" className="w-4 h-4 object-contain" /> TARTARUGA
              </a>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <div className="z-10 relative text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-xs font-bold uppercase tracking-widest mb-8 text-[#FDD935] shadow-[0_0_20px_rgba(253,217,53,0.15)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-pulse"></span>
                Powered by Xoeris
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[1.05] mb-6 tracking-tighter drop-shadow-2xl">
                Acelbyte <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#F59E0B] drop-shadow-[0_0_20px_rgba(253,217,53,0.5)]">
                  Official Website
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed font-medium">
                VFX • Coding • Photography • Cinematography • Music
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <a href="#works" className="flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-black transition-all duration-500 ease-hyper hover:-translate-y-1 active:scale-95 rounded-lg shadow-[0_0_20px_rgba(253,217,53,0.4)] hover:shadow-[0_0_40px_rgba(253,217,53,0.7)]" style={{ backgroundColor: colors.primary, color: '#000' }}>
                  View Works <Zap size={18} />
                </a>
                <a href="#contact" className="flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-bold border border-[#FDD935]/30 transition-all duration-500 ease-hyper hover:bg-[#FDD935]/10 hover:border-[#FDD935] active:scale-95 rounded-lg bg-[#FDD935]/5 backdrop-blur-md text-[#FDD935]">
                  <Terminal size={18} /> Contact Me
                </a>
              </div>
            </div>

            {/* Hero Visual - Futuristic Cyber Motif */}
            <div className="relative flex justify-center lg:justify-end items-center h-96 lg:h-full z-0 perspective-1000">
              <div className="relative w-full max-w-md transform rotate-[-10deg] hover:rotate-[-5deg] transition-transform duration-1000 ease-out group flex justify-center">

                {/* Tech blocks representing glowing server blades */}
                <div className="relative w-64 h-96 flex flex-col items-center justify-center gap-6">

                  {statusBlades.map((blade) => (
                    <div
                      key={blade.id}
                      className={`${blade.width} h-24 rounded-2xl backdrop-blur-2xl border transition-all duration-[600ms] ease-hyper-smooth ${blade.animation} flex items-center px-6 relative overflow-hidden group/blade ${blade.trackUrl ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                      style={{
                        backgroundColor: `${blade.color}0D`,
                        borderColor: `${blade.color}4D`,
                        boxShadow: `0 15px 30px rgba(0,0,0,0.5), 0 0 30px rgba(${blade.shadowColor}, 0.1)`
                      }}
                      onClick={() => toggleTrack(blade)}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-2 shadow-[0_0_15px]" style={{ backgroundColor: blade.color, color: blade.color }}></div>
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${blade.color}1A, transparent)` }}></div>

                      {/* Play Button Overlay - Only if track exists */}
                      {blade.trackUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover/blade:opacity-100 transition-opacity duration-300 z-20">
                          <div className="w-12 h-12 rounded-full border flex items-center justify-center" style={{ borderColor: blade.color, backgroundColor: `${blade.color}33`, boxShadow: `0 0 20px rgba(${blade.shadowColor}, 0.4)` }}>
                            {currentTrack === blade.id ? (
                              <Pause size={24} color={blade.color} fill={blade.color} className="animate-pulse" />
                            ) : (
                              <Play size={24} color={blade.color} fill={blade.color} className="ml-1" />
                            )}
                          </div>
                        </div>
                      )}

                      <div className={`w-full pl-4 flex flex-col gap-2 relative z-10 transition-all duration-300 ${blade.trackUrl ? 'group-hover/blade:blur-[2px]' : ''}`}>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] uppercase font-black tracking-widest" style={{ color: blade.color }}>{blade.label}</span>
                          <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] animate-pulse ${blade.delay}`} style={{ backgroundColor: blade.color, color: blade.color }}></div>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full shadow-[0_0_10px] transition-all duration-100 ease-linear"
                            style={{
                              backgroundColor: blade.color,
                              width: currentTrack === blade.id ? `${trackProgress}%` : blade.barWidth,
                              color: blade.color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>

                {/* Decorative floating cyber elements */}
                <div className="absolute -top-12 -right-12 w-32 h-32 border border-[#FDD935]/30 rounded-full animate-spin-slow opacity-60 flex items-center justify-center shadow-[inset_0_0_20px_rgba(253,217,53,0.2)]" style={{ animationDuration: '20s' }}>
                  <div className="w-24 h-24 border border-dashed border-[#FDD935]/40 rounded-full animate-spin-reverse-slow"></div>
                </div>
                <div className="absolute -bottom-16 -left-16 w-40 h-40 border border-[#F59E0B]/20 backdrop-blur-md rounded-2xl animate-pulse delay-150 opacity-40 transform rotate-45 shadow-[0_0_30px_rgba(245,158,11,0.2)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section id="about" className="py-24 px-6 md:px-12 relative border-t border-[#FDD935]/10 bg-black/40 backdrop-blur-sm text-white">
          <FadeIn className="max-w-7xl mx-auto">
            <div className="mb-20 text-center md:text-left md:w-2/3">
              <h2 className="text-sm font-black text-[#FDD935] uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_8px_rgba(253,217,53,0.8)]">The Profile</h2>
              <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">CREATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">TECHNOLOGIST.</span></h3>
              <p className="text-xl text-gray-400">Blending technical expertise with artistic flair to create captivating and innovative digital experiences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#FDD935]/40 hover:shadow-[0_0_40px_rgba(253,217,53,0.15)] transition-all duration-[400ms] ease-hyper hover:-translate-y-2 relative overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDD935] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#FDD935]/10 border border-[#FDD935]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(253,217,53,0.2)]">
                  <Globe size={32} className="text-[#FDD935] drop-shadow-[0_0_10px_rgba(253,217,53,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">The Origin</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  Acelbyte, the personal stage name of Marcell Oemar, is a 21-year-old creative talent from Indonesia. Renowned for his proficiency in VFX, coding, photography, cinematography, and music.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#FDD935]">
                  Indonesia <ArrowRight size={16} />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#F59E0B]/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-[400ms] ease-hyper hover:-translate-y-2 relative overflow-hidden rounded-3xl md:-translate-y-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]">
                  <Cpu size={32} className="text-[#F59E0B] drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Visual Engineering</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  Specializing in VFX and coding, Acelbyte excels at developing visually compelling effects that bring stories to life. His technical expertise is complemented by his keen eye for photography and cinematography.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#F59E0B]">
                  VFX & Code <ArrowRight size={16} />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-[#FDD935]/[0.02] backdrop-blur-2xl p-10 border border-[#FDD935]/10 hover:bg-[#FDD935]/[0.05] hover:border-[#FEF08A]/40 hover:shadow-[0_0_40px_rgba(254,240,138,0.15)] transition-all duration-[400ms] ease-hyper hover:-translate-y-2 relative overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FEF08A] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-200"></div>
                <div className="w-16 h-16 rounded-2xl bg-[#FEF08A]/10 border border-[#FEF08A]/30 flex items-center justify-center mb-8 shadow-[inset_0_0_15px_rgba(254,240,138,0.2)]">
                  <Shield size={32} className="text-[#FEF08A] drop-shadow-[0_0_10px_rgba(254,240,138,0.8)]" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Sonic Artistry</h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  A passionate musician, infusing his projects with original music compositions that add depth and emotional resonance. This blend of skills enables him to produce unique, multifaceted creations.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#FEF08A]">
                  Music <ArrowRight size={16} />
                </div>
              </div>
            </div>

            <div className="mt-16 text-center max-w-3xl mx-auto">
              <p className="text-lg text-gray-400 italic font-medium leading-relaxed">
                "Acelbyte's work is characterized by a dedication to excellence and a passion for pushing creative boundaries. His ability to seamlessly integrate technology and artistry makes him a distinctive and promising figure in the creative community."
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Works Section */}
        <section id="works" className="py-24 px-6 md:px-12 relative text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-sm font-black text-[#FDD935] uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_8px_rgba(253,217,53,0.8)]">Selected Projects</h2>
                <h3 className="text-4xl md:text-6xl font-black tracking-tight">DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">ARTIFACTS.</span></h3>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('digital-artifacts'); }} className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#FDD935] transition-colors duration-300 ease-hyper">
                View All Archives <ArrowRight size={16} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={(p) => { setSelectedProject(p); setModalVideoIndex(0); }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 text-white">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedProject(null)}></div>
            <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-[#FDD935]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(253,217,53,0.15)] animate-fade-in max-h-[90vh] overflow-y-auto">

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#FDD935] hover:text-black transition-all"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto min-h-[400px] bg-black">
                  {(selectedProject.videos || selectedProject.video) ? (
                    <video
                      src={selectedProject.videos ? selectedProject.videos[modalVideoIndex] : selectedProject.video}
                      poster={selectedProject.image}
                      autoPlay
                      loop={!selectedProject.videos || selectedProject.videos.length === 1}
                      muted
                      playsInline
                      onEnded={() => {
                        if (selectedProject.videos) {
                          setModalVideoIndex((prev) => (prev + 1) % selectedProject.videos.length);
                        }
                      }}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  ) : selectedProject.image ? (
                    <img src={selectedProject.image} alt={selectedProject.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-black"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r"></div>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/20 text-[#FDD935] text-xs font-black uppercase tracking-widest w-fit mb-6">
                    {selectedProject.category}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                    {selectedProject.title}
                  </h2>

                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  <div className="mb-10">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.stack.map((tech, index) => (
                        <span key={index} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a href="#" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FDD935] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#F59E0B] hover:scale-105 active:scale-95 transition-all duration-500 ease-hyper w-fit">
                    View Project <ArrowRight size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-black/80 backdrop-blur-3xl pt-20 pb-10 border-t border-[#FDD935]/20 mt-10 relative overflow-hidden text-white">
          {/* Footer Cyber Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-[#FDD935] opacity-5 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-16 mb-16 relative z-10">
            <div className="md:col-span-2">
              <a href="#" className="flex items-center gap-3 mb-6 group inline-flex">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 overflow-hidden">
                  <img src="/acelbyte-logo.png" alt="Acelbyte Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-[#FDD935] group-hover:to-white transition-all">ACELBYTE</span>
              </a>
              <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
                Showcasing the intersection of code, visual effects, and music. The personal portfolio of Marcell Oemar.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Socials</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="#" className="hover:text-[#FDD935] hover:drop-shadow-[0_0_5px_rgba(253,217,53,0.5)] transition-all duration-300 ease-hyper">Instagram</a></li>
                <li><a href="#" className="hover:text-[#FDD935] hover:drop-shadow-[0_0_5px_rgba(253,217,53,0.5)] transition-all duration-300 ease-hyper">LinkedIn</a></li>
                <li><a href="#" className="hover:text-[#FDD935] hover:drop-shadow-[0_0_5px_rgba(253,217,53,0.5)] transition-all duration-300 ease-hyper">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.2em] mb-6 drop-shadow-[0_0_5px_rgba(253,217,53,0.5)]">Ecosystem</h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="https://loomastudio.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('looma'); }} className="hover:text-white transition-colors duration-300 ease-hyper flex items-center gap-2 group"><img src="/looma-studio-logo.png" className="w-3.5 h-3.5 object-contain opacity-60 group-hover:opacity-100 transition-opacity" /> Looma Studio</a></li>
                <li><a href="https://xoeris.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('xoeris'); }} className="hover:text-white transition-colors duration-300 ease-hyper flex items-center gap-2 group"><img src="/xoeris-logo.png" className="w-3.5 h-3.5 object-contain opacity-60 group-hover:opacity-100 transition-opacity" /> Xoeris Data</a></li>
                <li><a href="https://tartaruga.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('tartaruga'); }} className="hover:text-white transition-colors duration-300 ease-hyper flex items-center gap-2 group"><img src="/tartaruga-logo.png" className="w-3.5 h-3.5 object-contain opacity-60 group-hover:opacity-100 transition-opacity" /> Tartaruga</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm font-medium relative z-10">
            <p>Copyright &copy; 2018 - 2026 Acelbyte. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#FDD935] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#FDD935] transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
