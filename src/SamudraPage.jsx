import React, { useState, useEffect } from 'react';
import {
  MapPin, Cloud, TrendingUp, Signal, Sun,
  Weight, Activity, CheckCircle, Smartphone,
  ArrowLeft, Bell, Settings, Info, Navigation2,
  Battery, Wind, Droplets, Zap, ChevronRight
} from 'lucide-react';

export default function SamudraPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
        <Smartphone size={64} className="mb-6 text-[#705EBC]" />
        <h1 className="text-3xl font-bold mb-4">SAMUDRA Mobile Only</h1>
        <p className="text-gray-400 max-w-md">
          Aplikasi SAMUDRA didesain khusus untuk penggunaan di perangkat mobile nelayan.
          Silakan buka halaman ini melalui smartphone Anda untuk mendapatkan akses penuh.
        </p>
        <button
          onClick={() => onNavigate('xoeris')}
          className="mt-8 px-6 py-3 bg-[#705EBC] rounded-full font-bold hover:scale-105 transition-transform"
        >
          Kembali ke Xoeris
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans pb-24">
      {/* Status Bar Background */}
      <div className="h-6 w-full bg-[#0A0A0B]"></div>

      {/* App Bar */}
      <header className="px-6 py-4 flex justify-between items-center bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-30">
        <button onClick={() => onNavigate('xoeris')} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-black tracking-widest text-[#705EBC]">SAMUDRA</h1>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">System Online</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-400">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="px-6 pt-4 space-y-6">
        {/* Device Integration Overview (Solar & Internet) */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-[#151518] border border-white/5 p-4 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Sun size={48} className="text-[#F9CB43]" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-[#F9CB43]/10 rounded-lg">
                <Zap size={16} className="text-[#F9CB43]" />
              </div>
              <span className="text-xs font-medium text-gray-400">Solar Power</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold">88%</span>
              <span className="text-[10px] text-green-500 mb-1 font-bold">Charging</span>
            </div>
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F9CB43] rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div className="bg-[#151518] border border-white/5 p-4 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Signal size={48} className="text-blue-400" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <Signal size={16} className="text-blue-400" />
              </div>
              <span className="text-xs font-medium text-gray-400">Net Signal</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold">Excellent</span>
            </div>
            <div className="mt-2 flex gap-0.5 items-end h-3">
              <div className="w-1 h-1 bg-blue-400 rounded-t-sm"></div>
              <div className="w-1 h-1.5 bg-blue-400 rounded-t-sm"></div>
              <div className="w-1 h-2 bg-blue-400 rounded-t-sm"></div>
              <div className="w-1 h-3 bg-blue-400 rounded-t-sm"></div>
            </div>
          </div>
        </section>

        {/* Fish Box Indicator (Main Feature) */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold">Penyimpanan Ikan</h2>
            <span className="text-xs text-[#705EBC] font-bold">Box Indikator #01</span>
          </div>

          <div className="bg-gradient-to-br from-[#151518] to-[#0A0A0B] border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status Tangkapan</p>
                <h3 className="text-2xl font-bold text-white">Sangat Layak</h3>
              </div>
              <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30">
                Fresh
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Weight size={20} className="text-[#705EBC]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Berat</p>
                  <p className="text-lg font-bold">4.2 kg</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Activity size={20} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Ukuran</p>
                  <p className="text-lg font-bold">45 cm</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <CheckCircle size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Kesehatan</p>
                  <p className="text-lg font-bold">Optimal</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <TrendingUp size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Harga Pasar</p>
                  <p className="text-lg font-bold text-blue-400">Rp 85k</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-500 font-medium">Kapasitas Box</span>
                <span className="text-white font-bold">642 / 1000 kg</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#705EBC] to-blue-500 rounded-full" style={{ width: '64.2%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Info Grid */}
        <section className="grid grid-cols-2 gap-4">
          {/* Weather */}
          <div className="bg-[#151518] p-4 rounded-3xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Cloud size={20} className="text-blue-400" />
              </div>
              <span className="text-[10px] font-bold text-gray-500">CUACA</span>
            </div>
            <p className="text-2xl font-bold">28°C</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Cerah Berawan</p>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-500">
               <Wind size={12} /> 12km/h <Droplets size={12} className="ml-1" /> 74%
            </div>
          </div>

          {/* Fish Radar/Location */}
          <div className="bg-[#151518] p-4 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#705EBC]/10 rounded-bl-full border-l border-b border-[#705EBC]/20"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#705EBC]/10 rounded-xl">
                <MapPin size={20} className="text-[#705EBC]" />
              </div>
              <span className="text-[10px] font-bold text-gray-500">LOKASI</span>
            </div>
            <p className="text-sm font-bold leading-tight">Zona C-12 <br/><span className="text-[#705EBC]">Banyak Ikan</span></p>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-white bg-[#705EBC] w-fit px-2 py-0.5 rounded-full">
              <Navigation2 size={8} className="fill-white" /> BUKA RADAR
            </div>
          </div>
        </section>

        {/* Market Trend Card */}
        <section className="bg-[#151518] p-5 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              <h3 className="font-bold text-sm">Update Harga Ikan</h3>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs text-gray-300">Tuna Mata Besar</span>
              <div className="text-right">
                <p className="text-sm font-bold">Rp 120k</p>
                <p className="text-[10px] text-green-500 font-bold">+5.2%</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-gray-300">Cakalang</span>
              <div className="text-right">
                <p className="text-sm font-bold">Rp 45k</p>
                <p className="text-[10px] text-green-500 font-bold">+2.1%</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0A0A0B]/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 flex justify-between items-center z-40">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-[#705EBC]' : 'text-gray-500'}`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'dashboard' ? 'bg-[#705EBC]/10' : ''}`}>
            <Activity size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Status</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-[#705EBC]' : 'text-gray-500'}`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'map' ? 'bg-[#705EBC]/10' : ''}`}>
            <MapPin size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Radar</span>
        </button>

        {/* Center Floating Button */}
        <div className="relative -top-6">
          <div className="absolute inset-0 bg-[#705EBC] blur-xl opacity-20 animate-pulse"></div>
          <button className="bg-gradient-to-tr from-[#705EBC] to-blue-500 p-4 rounded-[1.5rem] shadow-[0_10px_30px_rgba(112,94,188,0.4)] relative">
            <Smartphone size={28} className="text-white" />
          </button>
        </div>

        <button
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'market' ? 'text-[#705EBC]' : 'text-gray-500'}`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'market' ? 'bg-[#705EBC]/10' : ''}`}>
            <TrendingUp size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Market</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'info' ? 'text-[#705EBC]' : 'text-gray-500'}`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'info' ? 'bg-[#705EBC]/10' : ''}`}>
            <Info size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Info</span>
        </button>
      </nav>

      {/* Mobile Design Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-tap-highlight-color: transparent;
        }

        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}} />
    </div>
  );
}
