import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Hexagon, Mail, Phone, Globe, Play } from 'lucide-react';
import FadeIn from './components/FadeIn';

export default function LoomaPage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Profile', href: '#profile' },
    { name: 'Vision', href: '#vision' },
    { name: 'Services', href: '#scope' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="animate-fade-in relative z-10 text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 gpu-accel ${isScrolled ? 'py-4 shadow-lg backdrop-blur-xl bg-black/40 border-b border-white/10' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="/loomastudio" onClick={(e) => { e.preventDefault(); onNavigate('looma'); }} className="flex items-center group">
            <div className="relative w-14 h-14 transition-transform group-hover:scale-110">
              <img src="/looma-studio-logo.png" alt="Looma Studio Logo" className="w-14 h-14 object-contain" />
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
            
            <div className="w-px h-6 bg-white/20"></div>

            <div className="flex items-center gap-4">
              <a href="https://acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('acelbyte'); }} className="flex items-center gap-1.5 text-sm font-bold text-[#FDD935] hover:text-white transition-colors">
                <img src="/acelbyte-logo.png" alt="Acelbyte" className="w-4 h-4 object-contain" /> Acelbyte
              </a>
              <a href="https://xoeris.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('xoeris'); }} className="flex items-center gap-1.5 text-sm font-bold text-[#5A4DB2] hover:text-white transition-colors">
                <img src="/xoeris-logo.png" alt="Xoeris" className="w-4 h-4 object-contain" /> Xoeris
              </a>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-xl py-4 flex flex-col items-center gap-4">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="text-lg font-medium text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>{link.name}</a>
            ))}
            <div className="w-1/2 h-px bg-white/10 my-2"></div>
            <a href="https://acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('acelbyte'); setMobileMenuOpen(false); }} className="text-lg font-bold text-[#FDD935] py-2 flex items-center gap-2">
              <img src="/acelbyte-logo.png" alt="Acelbyte" className="w-5 h-5 object-contain" /> Switch to Acelbyte
            </a>
            <a href="https://xoeris.acelbyte.com" onClick={(e) => { e.preventDefault(); onNavigate('xoeris'); setMobileMenuOpen(false); }} className="text-lg font-bold text-[#5A4DB2] py-2 flex items-center gap-2">
              <img src="/xoeris-logo.png" alt="Xoeris" className="w-5 h-5 object-contain" /> Switch to Xoeris
            </a>
          </div>
        )}
      </nav>

      {/* 1. Cover Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none gpu-accel">
           <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#5A4DB2] opacity-15 blur-[80px] rounded-full will-change-filter" />
           <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#F0805E] opacity-15 blur-[80px] rounded-full will-change-filter" />
        </div>

        <FadeIn className="relative z-10 flex flex-col items-center space-y-8">
          <div className="w-48 h-48 md:w-64 md:h-64 relative mb-4 animate-float mt-24">
             <img src="/looma-studio-logo.png" alt="Looma Logo" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
          </div>

          <img 
            src="/looma-studio-logo-text.png" 
            alt="Looma Studio" 
            className="w-full max-w-[30vw] md:max-w-sm h-auto object-contain drop-shadow-lg"
          />

          <p className="font-sans text-sm md:text-xl tracking-[0.3em] uppercase text-gray-300 border-t border-b border-white/10 py-4 px-8">
            Looming the future into your brand
          </p>
        </FadeIn>
      </section>

      {/* 2. Company Profile */}
      <section id="profile" className="relative w-full min-h-screen py-24 px-6 md:px-16 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-custom text-[#FDD935] leading-tight mb-8">
              COMPANY<br />PROFILE
            </h2>
            <div className="text-sm text-gray-500 font-sans tracking-widest uppercase border-l-2 border-[#FDD935] pl-4">
              <p>Looma Studio</p>
              <p>Est. 2026</p>
            </div>
          </FadeIn>

          <FadeIn delay={200} className="font-sans text-gray-300 text-lg leading-relaxed space-y-6 text-justify">
            <p>
              Looma Studio adalah creative agency yang berdiri tahun 2026. Looma lahir dari sebuah filosofi alat tenun (loom), Sebuah tempat di mana strategi, riset, dan estetika dipintal menjadi satu kesatuan. Kami percaya bahwa desain tidak bisa berdiri sendiri. Kami melihat sebuah brand sebagai satu ekosistem yang hidup, di mana strategi, identitas visual, hingga pengalaman digital adalah benang-benang yang saling menguatkan.
            </p>
            <p>
              Looma Studio berfokus pada Branding, Identitas Visual sampai sebuah Promosi yang kami rangkai menjadi satu kesatuan cerita yang harus disampaikan secara konsisten. Proses kami selalu dengan mendengarkan dan memahami masalah yang sedang dihadapi, kemudian melakukan riset sampai akhirnya bisa menghasilkan jawaban dari masalah itu.
            </p>
            <p>
              Lewat pendekatan yang manusiawi, Looma hadir bukan sekadar untuk mempercantik tampilan, tapi untuk memastikan setiap detail desain terasa hidup, fungsional, dan mampu membawa dampak nyata bagi pertumbuhan brand Anda.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3. Vision & Mission */}
      <section id="vision" className="relative w-full min-h-screen py-24 px-6 md:px-16 flex flex-col justify-center bg-white/5 backdrop-blur-sm gpu-accel">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Visi */}
          <FadeIn className="space-y-6 sticky top-32">
            <h2 className="text-6xl md:text-8xl font-custom text-[#FDD935] tracking-wider">VISI</h2>
            <p className="text-2xl md:text-3xl font-serif italic leading-relaxed text-gray-200 border-l-4 border-[#F0805E] pl-6 py-2">
              "Menjadi ekosistem kreatif terdepan yang menenun strategi dan estetika menjadi identitas brand yang hidup, berdampak luas, dan relevan di masa depan."
            </p>
          </FadeIn>

          {/* Misi */}
          <FadeIn delay={200} className="space-y-12">
            <h2 className="text-6xl md:text-8xl font-custom text-[#FDD935] tracking-wider">MISI</h2>
            <div className="space-y-8">
              <p className="text-lg font-bold text-white uppercase tracking-widest mb-8">
                Untuk mencapai visi tersebut, Looma Studio berkomitmen untuk:
              </p>
              {[
                { title: "Menganyam Strategi dengan Presisi (Strategic Weaving)", desc: "Melakukan riset mendalam untuk memahami akar masalah dan potensi unik setiap brand." },
                { title: "Menciptakan Identitas yang Hidup (Living Identity)", desc: "Membangun identitas visual dan pengalaman digital yang fungsional and adaptif." },
                { title: "Mengedepankan Pendekatan Manusiawi (Human-Centric)", desc: "Menempatkan empati dan interaksi manusia sebagai inti dari setiap proses kreatif." },
                { title: "Mendorong Pertumbuhan Berkelanjutan (Sustainable Growth)", desc: "Menghasilkan karya yang memberikan dampak nyata dan jangka panjang." },
                { title: "Menyatukan Elemen yang Terpisah (Creative Integration)", desc: "Mengintegrasikan strategi, desain, dan promosi menjadi satu kesatuan cerita." }
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border border-[#F0805E] text-[#F0805E] flex items-center justify-center text-lg font-bold group-hover:bg-[#F0805E] group-hover:text-white transition-all duration-300">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1 group-hover:text-[#F0805E] transition-colors">{item.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. Tagline Philosophy */}
      <section className="relative w-full min-h-[60vh] py-24 px-6 md:px-16 flex flex-col justify-center items-center text-center bg-gradient-to-b from-transparent to-black/80">
        <div className="max-w-5xl mx-auto space-y-16">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-custom text-[#FDD935] tracking-wide leading-tight mb-8">
              LOOMING THE FUTURE<br />OF YOUR BRAND
            </h2>
            <div className="w-32 h-1.5 bg-[#F0805E] mx-auto rounded-full" />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 text-left">
            <FadeIn delay={200} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#F0805E]/50 transition-colors">
              <span className="text-[#F0805E] font-bold block mb-4 text-xl tracking-widest uppercase">Definisi Alat Tenun (Loom)</span>
              <p className="text-gray-300 leading-relaxed">
                Merujuk pada alat tenun (loom). Masa depan brand klien tidak terjadi secara instan atau kebetulan, melainkan ditenun helai demi helai. Benang strategi, benang riset, dan benang estetika disatukan dengan presisi di Looma Studio hingga membentuk struktur masa depan yang kokoh.
              </p>
            </FadeIn>
            
            <FadeIn delay={400} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#F0805E]/50 transition-colors">
               <span className="text-[#F0805E] font-bold block mb-4 text-xl tracking-widest uppercase">Makna Bahasa ("Looming")</span>
               <p className="text-gray-300 leading-relaxed">
                Dalam bahasa Inggris, looming juga berarti sesuatu yang besar dan signifikan mulai tampak di cakrawala. Ini memberi kesan antisipasi dan dominasi. Brand klien Anda bukan lagi sekadar nama kecil, tapi sesuatu yang "mulai terlihat besar" dan siap mengambil alih perhatian pasar.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 5. Team */}
      <section id="team" className="relative w-full py-32 px-6 md:px-12 bg-black/50 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-custom text-[#FDD935] mb-24 tracking-widest relative inline-block">
              MEET THE TEAM
              <span className="absolute -top-6 -right-12 text-8xl text-[#F0805E] transform rotate-12 font-serif">!</span>
            </h2>
          </FadeIn>
          
          {/* Detailed Portfolio Section - Appears when a member is selected */}
          {selectedMember && (
            <div className="mb-20 animate-page-slide-in relative z-20 gpu-accel">
              <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FDD935] hover:text-black transition-all duration-300 ease-hyper active:scale-90 z-30"
                >
                  <X size={24} />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Member Bio Column */}
                  <div className="lg:col-span-4 text-left space-y-6">
                    <div className="relative w-48 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-[#FDD935]/50 shadow-[0_0_30px_rgba(253,217,53,0.2)]">
                      <img 
                        src={selectedMember.image} 
                        alt={selectedMember.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-4xl font-custom text-[#FDD935] tracking-widest mb-2">{selectedMember.name}</h3>
                      <p className="text-sm font-bold uppercase tracking-widest text-gray-400 border-l-2 border-[#F0805E] pl-4">{selectedMember.role}</p>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "Dedicated to weaving helai demi helai strategy and aesthetics into digital art."
                    </p>
                  </div>

                  {/* Cinematic Portfolio Slider Column */}
                  <div className="lg:col-span-8 space-y-8 overflow-hidden">
                    <div className="flex items-center justify-between">
                       <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                         <span className="w-2 h-2 rounded-full bg-[#FDD935] animate-ping"></span>
                         Portfolio Showreel
                       </h4>
                       <span className="text-xs text-gray-500 font-medium tracking-widest">{selectedMember.portfolio.length} WORKS ARCHIVED</span>
                    </div>

                    <div className="relative group/portfolio">
                      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing">
                        {selectedMember.portfolio.map((img, i) => (
                          <div 
                            key={i} 
                            className="flex-shrink-0 h-80 rounded-[30px] overflow-hidden border border-white/10 bg-black/40 snap-center hover:border-[#FDD935]/50 hover:shadow-[0_0_40px_rgba(253,217,53,0.1)] transition-all duration-500 group/item relative"
                          >
                            <img 
                              src={img} 
                              alt={`${selectedMember.name} work ${i}`} 
                              className="h-full w-auto object-contain transition-transform duration-700 group-hover/item:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex items-end p-6">
                               <span className="text-xs font-black uppercase tracking-widest text-white border-l border-[#FDD935] pl-3">Artifact #{i+1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Navigation hints */}
                      <div className="flex justify-center gap-2 mt-4">
                        {selectedMember.portfolio.slice(0, 5).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-[#FDD935] w-6' : 'bg-white/20'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ${selectedMember ? 'opacity-40 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
            {[
              { 
                name: "ACEL", 
                role: "Graphic Designer & UI/UX Designer", 
                image: "/acel.png",
                portfolio: [
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2622&auto=format&fit=crop"
                ]
              },
              { 
                name: "BAGAS", 
                role: "Graphic Designer & Visual Storyteller", 
                image: "/bagas.png",
                portfolio: [
                  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2670&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
                ]
              },
              { 
                name: "NAIA", 
                role: "Creative Director & Graphic Designer", 
                image: "/naia.png",
                portfolio: [
                  "/naia/1.png", "/naia/2.png", "/naia/3.png", "/naia/4.png", 
                  "/naia/5.png", "/naia/6.png", "/naia/7.png", "/naia/8.png",
                  "/naia/12.png", "/naia/13.png", "/naia/14.png", "/naia/15.png", "/naia/16.png"
                ]
              },
              { 
                name: "VITO", 
                role: "Graphic Designer & Digital Marketing", 
                image: "/vito.png",
                portfolio: [
                  "/vito/1.png", "/vito/2.png", "/vito/3.png", "/vito/4.png", 
                  "/vito/5.png", "/vito/6.png", "/vito/7.png", "/vito/8.png",
                  "/vito/9.png", "/vito/10.png", "/vito/11.png", "/vito/12.png",
                  "/vito/13.png", "/vito/14.png", "/vito/15.png", "/vito/16.png",
                  "/vito/17.png", "/vito/18.png", "/vito/19.png", "/vito/20.png",
                  "/vito/21.png", "/vito/22.png", "/vito/23.png"
                ]
              }
            ].map((member, idx) => (
              <FadeIn 
                key={idx} 
                delay={idx * 100} 
                className={`group relative flex flex-col gap-4 cursor-pointer transition-all duration-500 hover:-translate-y-2 ${selectedMember?.name === member.name ? 'ring-2 ring-[#FDD935] rounded-[40px] p-2 bg-[#FDD935]/10' : ''}`}
                onClick={() => setSelectedMember(member)}
              >
                <div className="relative overflow-hidden rounded-[30px] aspect-[9/16] bg-white/5 border border-white/10 group-hover:border-[#FDD935] transition-all duration-500 shadow-xl">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#FDD935] text-black flex items-center justify-center shadow-[0_0_20px_rgba(253,217,53,0.6)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-custom text-white tracking-widest group-hover:text-[#FDD935] transition-colors uppercase">{member.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#F0805E] border-t border-white/10 pt-2 opacity-70">{member.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Scope of Work */}
      <section id="scope" className="relative w-full min-h-screen py-24 px-6 md:px-16 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-custom text-[#FDD935] tracking-wider mb-20 text-center md:text-left">
              SCOPE OF WORK
            </h2>
          </FadeIn>

          <div className="grid gap-8">
            {[
              { id: "01", title: "Brand Identity", desc: ["Logo, color, guideline, tone visual", "Visual assets (2D/3D graphics, illustration, motion)", "UI/UX design (website, app, digital outputs)"], color: "#F0805E" },
              { id: "02", title: "Media Campaign & Content Execution", desc: ["Videography & Photography (marketing, product, campaign)", "Creative Content & design copy (feeds, reels, digital ads, dll)", "Media Campaign & content execution"], color: "#FDD935" },
              { id: "03", title: "Rules of Engagement", desc: ["Work Process & Executions (online & offline)", "Social media Strategic & management", "Marketing management & solving"], color: "#5A4DB2" }
            ].map((item, index) => (
              <FadeIn key={item.id} delay={index * 150}>
                <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8 overflow-hidden group hover:bg-white/10 transition-all duration-500">
                  <span className="absolute -right-4 -bottom-10 text-[150px] font-bold text-white opacity-5 font-custom select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                    {item.id}
                  </span>

                  <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl text-black shadow-[0_0_20px_rgba(0,0,0,0.3)]" style={{ backgroundColor: item.color }}>
                    {item.id}
                  </div>

                  <div className="flex-grow space-y-4">
                    <h3 className="text-2xl md:text-3xl font-custom text-white tracking-wide group-hover:text-[#FDD935] transition-colors">
                      {item.title}
                    </h3>
                    <ul className="space-y-2 text-gray-300 md:grid md:grid-cols-2 gap-x-8">
                      {item.desc.map((d, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FDD935]" />
                          <span className="leading-relaxed">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Media Collateral */}
      <section className="relative w-full min-h-screen py-24 px-6 md:px-16 flex flex-col items-center">
        <div className="max-w-7xl mx-auto w-full">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-custom text-[#FDD935] tracking-wider mb-20 text-center">
              MEDIA COLLATERAL
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ID Card */}
            <FadeIn className="aspect-[3/2] relative group">
              <div className="w-full h-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-xl group-hover:border-[#FDD935]/50 transition-all duration-300">
                 <div className="w-12 h-12 rounded-full bg-[#5A4DB2]/50 mb-4" />
                 <div className="space-y-2">
                   <div className="w-3/4 h-3 bg-white/30 rounded" />
                   <div className="w-1/2 h-3 bg-white/20 rounded" />
                 </div>
                 <div className="absolute top-4 right-4 w-6 h-6 rounded-full border border-[#FDD935]" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#F0805E] text-white text-xs font-bold px-3 py-1 rounded-full">ID CARD</div>
            </FadeIn>

            {/* PIN */}
            <FadeIn delay={100} className="aspect-[3/2] relative group">
              <div className="w-full h-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shadow-xl group-hover:border-[#FDD935]/50 transition-all duration-300">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F0805E] to-[#5A4DB2] flex items-center justify-center shadow-lg">
                    <span className="font-custom font-bold text-4xl text-white">L</span>
                 </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#F0805E] text-white text-xs font-bold px-3 py-1 rounded-full">PIN</div>
            </FadeIn>

            {/* Business Card */}
            <FadeIn delay={200} className="aspect-[3/2] relative group">
              <div className="w-full h-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 relative overflow-hidden shadow-xl group-hover:border-[#FDD935]/50 transition-all duration-300">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDD935]/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                 <div className="h-full flex flex-col justify-center">
                   <h3 className="font-custom text-2xl text-white mb-1">LOOMA</h3>
                   <p className="text-xs text-gray-300 tracking-widest uppercase">Creative Studio</p>
                 </div>
                 <div className="absolute bottom-6 right-6 text-right">
                   <div className="w-20 h-1 bg-[#F0805E] mb-1 ml-auto" />
                   <p className="text-[10px] text-gray-400">Jakarta, Indonesia</p>
                 </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#F0805E] text-white text-xs font-bold px-3 py-1 rounded-full">BUSINESS CARD</div>
            </FadeIn>
             
             {/* Large T-Shirt Mockup Area */}
             <FadeIn delay={300} className="md:col-span-3 aspect-[2/1] bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                <div className="text-[10rem] opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700">👕</div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <h3 className="text-4xl font-custom text-white tracking-widest drop-shadow-lg">MERCHANDISE</h3>
                </div>
                <div className="absolute bottom-6 right-6 bg-[#F0805E] text-white text-xs font-bold px-3 py-1 rounded-full">
                  T-SHIRT
                </div>
             </FadeIn>
          </div>
        </div>
      </section>

      {/* 8. Portfolio */}
      <section className="relative w-full py-24 px-6 md:px-16 flex flex-col items-center bg-black/40">
        <div className="max-w-7xl mx-auto w-full text-center space-y-16">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-custom text-[#FDD935] tracking-wider">
              CHECK OUR PORTFOLIO
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Digital Marketing", color: "#F0805E" },
              { title: "UI/UX", color: "#5A4DB2" },
              { title: "Branding", color: "#FDD935" },
              { title: "Commercial", color: "#F0805E" }
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 100} className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#FDD935] transition-all">
                 <div className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-40" style={{ backgroundColor: item.color }} />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-black/50">
                       <span className="text-2xl font-serif text-white">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-custom text-white tracking-widest uppercase">{item.title}</h3>
                 </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400} className="max-w-xs mx-auto bg-white p-6 rounded-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="w-full aspect-square border-4 border-black border-dashed rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-black">QR</span>
             </div>
             <p className="text-black font-bold text-center text-sm uppercase tracking-widest">Scan for more</p>
          </FadeIn>
        </div>
      </section>

      {/* 9. Contact */}
      <section id="contact" className="relative w-full min-h-screen py-24 px-6 md:px-16 flex flex-col justify-center items-center text-center">
        <div className="max-w-4xl mx-auto space-y-16">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-custom text-[#FDD935] tracking-wider mb-12">
              CONTACT US!
            </h2>
          </FadeIn>

          <div className="space-y-8 flex flex-col items-center">
             <FadeIn delay={100}>
               <a href="mailto:contact@loomastudio.com" className="flex items-center gap-6 text-xl md:text-3xl hover:text-[#FDD935] transition-colors group">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FDD935] group-hover:text-black transition-colors">
                   <Mail size={24} />
                 </div>
                 <span className="font-sans tracking-wide">contact@loomastudio.com</span>
               </a>
             </FadeIn>

             <FadeIn delay={200}>
               <a href="tel:+6281234567891" className="flex items-center gap-6 text-xl md:text-3xl hover:text-[#FDD935] transition-colors group">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FDD935] group-hover:text-black transition-colors">
                   <Phone size={24} />
                 </div>
                 <span className="font-sans tracking-wide">+62-812-3456-7891</span>
               </a>
             </FadeIn>

             <FadeIn delay={300}>
               <a href="https://www.loomastudio.acelbyte.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-xl md:text-3xl hover:text-[#FDD935] transition-colors group">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FDD935] group-hover:text-black transition-colors">
                   <Globe size={24} />
                 </div>
                 <span className="font-sans tracking-wide">www.loomastudio.acelbyte.com</span>
               </a>
             </FadeIn>
          </div>

          <FadeIn delay={500} className="pt-20 border-t border-white/10 w-full flex justify-center">
            <img 
              src="/looma-studio-logo-text.png" 
              alt="Looma Studio" 
              className="h-12 md:h-16 object-contain opacity-50 hover:opacity-100 transition-opacity duration-500"
            />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
