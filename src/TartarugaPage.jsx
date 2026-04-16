import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Zap, ShieldCheck, Truck, ExternalLink } from 'lucide-react';
import FadeIn from './components/FadeIn';

const products = [
  {
    id: 1,
    title: "Tartaruga Mini Sheet Crispy Seaweed Barbeque",
    specs: "3.2 g x 12 pcs",
    description: "Experience the smoky, savory delight of our signature barbeque crispy seaweed. Perfectly roasted for that crunch you crave.",
    image: "/food1.jpeg",
    price: "Rp 35.000",
    link: "https://www.tokopedia.com/tartarugacrispyseaweed/tartaruga-mini-sheet-crispy-seaweed-barbeque-3-2-g-x-12-pcs?extParam=src%3Dshop%26whid%3D12517962&aff_unique_id=&channel=others&chain_key=",
    color: "#F59E0B",
    tag: "Best Seller"
  },
  {
    id: 2,
    title: "Tartaruga Mini Sheet Crispy Seaweed Hot and Spicy",
    specs: "3.2 g x 12 pcs",
    description: "Ignite your taste buds with our Hot and Spicy variety. A balanced heat that keeps you coming back for more crunch.",
    image: "/food2.jpeg",
    price: "Rp 35.000",
    link: "https://www.tokopedia.com/tartarugacrispyseaweed/tartaruga-mini-sheet-crispy-seaweed-hot-spicy-3-2-g-x-12-pcs?extParam=src%3Dshop%26whid%3D12517962&aff_unique_id=&channel=others&chain_key=",
    color: "#EF4444",
    tag: "Trending"
  }
];

export default function TartarugaPage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-[#FDD935] selection:text-black">
      
      {/* Dynamic Background Blobs based on the new palette */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#FDD935] blur-[150px] opacity-[0.15] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[50vw] h-[50vw] bg-[#F0805E] blur-[150px] opacity-[0.1] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] bg-[#1D1B4B] blur-[120px] opacity-[0.2] rounded-full animate-float"></div>
        {/* Subtle grid for tech aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(253,217,53,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 backdrop-blur-xl bg-black/40 border-b border-[#FDD935]/20 shadow-2xl' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <img src="/tartaruga-logo.png" alt="Tartaruga Logo" className="w-14 h-14 object-contain" />
            
            <button 
              onClick={() => onNavigate('acelbyte')}
              className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#FDD935]/50 group-hover:bg-[#FDD935]/10 transition-all">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest hidden sm:inline">Back to Acelbyte</span>
            </button>
          </div>

          <div className="w-24 hidden sm:block"></div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="text-center mb-32">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/20 text-[#FDD935] text-xs font-black uppercase tracking-widest mb-8">
              <Zap size={14} fill="#FDD935" /> Freshly Roasted • 100% Organic
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
              CRISPY <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] via-[#F0805E] to-[#FDD935] bg-[length:200%_auto] animate-gradient-shift">SEAWEED</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Elevating the snack experience with premium ingredients and unmatched crunch. 
              Discover the authentic taste of Tartaruga.
            </p>
          </FadeIn>
        </section>

        {/* Marketplace Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {products.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 200}>
              <div className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-[#FDD935]/50 hover:bg-white/[0.08] transition-all duration-500 hover:shadow-[0_0_50px_rgba(253,217,53,0.15)]">
                
                {/* Product Image Container */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <div className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-white">
                    {product.tag}
                  </div>
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Content */}
                <div className="p-10">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-black leading-tight tracking-tight max-w-[70%]">
                      {product.title}
                    </h2>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-400 mb-1">{product.specs}</div>
                      <div className="text-2xl font-black text-[#FDD935]">{product.price}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-6 mb-10">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                      <Star size={16} fill={product.color} color={product.color} /> 4.9 Rating
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                      <Truck size={16} className="text-[#FDD935]" /> Fast Delivery
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                      <ShieldCheck size={16} className="text-[#FDD935]" /> Quality Guaranteed
                    </div>
                  </div>

                  <a 
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-[#FDD935] text-black font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#F0805E] hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(253,217,53,0.3)] hover:shadow-[0_20px_40px_rgba(253,217,53,0.4)]"
                  >
                    Buy on Tokopedia <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </section>

        {/* Brand values / Why Tartaruga */}
        <section className="mt-40">
          <FadeIn>
            <div className="bg-gradient-to-br from-[#FDD935]/10 to-[#F0805E]/5 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FDD935]/50 to-transparent"></div>
               <h3 className="text-xs font-black text-[#FDD935] uppercase tracking-[0.5em] mb-6">The Tartaruga Standard</h3>
               <h2 className="text-4xl md:text-6xl font-black mb-8">WHY CHOOSE OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">SEAWEED?</span></h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mt-16">
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-white">Premium Grade</h4>
                    <p className="text-gray-400">We source only the finest seaweed from sustainable farms, ensuring every bite is packed with nutrients and flavor.</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-white">Expert Roasting</h4>
                    <p className="text-gray-400">Our proprietary roasting process creates a unique texture that is incredibly light yet satisfyingly crispy.</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-white">Bold Flavors</h4>
                    <p className="text-gray-400">Each seasoning is carefully crafted to complement the natural ocean taste without overpowering it.</p>
                  </div>
               </div>
            </div>
          </FadeIn>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-3xl border-t border-[#FDD935]/20 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-black tracking-tighter text-[#FDD935]">TARTARUGA</span>
             </div>
             <p className="text-gray-500 font-medium">© 2024 Tartaruga Creespy Seaweed. All rights reserved.</p>
          </div>
          
          <div className="flex gap-10">
            <a href="#" className="text-gray-400 hover:text-[#FDD935] font-bold uppercase tracking-widest text-xs transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-[#FDD935] font-bold uppercase tracking-widest text-xs transition-colors">Tokopedia</a>
            <a href="#" className="text-gray-400 hover:text-[#FDD935] font-bold uppercase tracking-widest text-xs transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% auto;
          animation: gradientShift 4s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
