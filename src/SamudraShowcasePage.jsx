import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export default function SamudraShowcasePage({ onNavigate }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
      else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
      else if (videoRef.current.msRequestFullscreen) videoRef.current.msRequestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[500] flex flex-col overflow-hidden">
      {/* Background Cinematic Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(112,94,188,0.15)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Top Header */}
      <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <button
          onClick={() => onNavigate(isMobile ? 'samudra' : 'voltrix')}
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {isMobile ? 'Back to App' : 'Back to Voltrix'}
        </button>
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#705EBC]">Voltrix R&D Showcase</span>
           <span className="text-xl font-black tracking-tighter uppercase text-white">SAMUDRA Visuals</span>
        </div>
      </header>

      {/* Video Container */}
      <div className="relative flex-1 flex items-center justify-center p-4 md:p-20">
        <div className="relative w-full max-w-6xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(112,94,188,0.2)] bg-black">
          <video
            ref={videoRef}
            src="/samudra_showcase.mp4"
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover cursor-pointer"
            onClick={togglePlay}
          />

          {/* Overlay Controls */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
             <div className="flex gap-6 items-center">
                <button onClick={togglePlay} className="text-white hover:text-[#705EBC] transition-colors bg-transparent border-none">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button onClick={toggleMute} className="text-white hover:text-[#705EBC] transition-colors bg-transparent border-none">
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
             </div>
             <button onClick={handleFullscreen} className="text-white hover:text-[#705EBC] transition-colors bg-transparent border-none">
                <Maximize size={24} />
             </button>
          </div>
        </div>
      </div>

      {/* Bottom Label */}
      <footer className="absolute bottom-0 left-0 w-full p-8 flex justify-center z-50">
         <div className="flex items-center gap-4 text-gray-500 font-medium text-[10px] uppercase tracking-[0.3em]">
            <span>System Terminal</span>
            <div className="w-1 h-1 rounded-full bg-[#705EBC] animate-pulse"></div>
            <span>v2.0 Visual Node</span>
         </div>
      </footer>
    </div>
  );
}
