import React, { useState, useEffect } from 'react';
import {
  MapPin, Cloud, TrendingUp, Signal, Sun,
  Weight, Activity, CheckCircle, Smartphone,
  ArrowLeft, Bell, Settings, Info, Navigation2,
  Wind, Droplets, Zap, ChevronRight,
  Plus, Minus, Power
} from 'lucide-react';

export default function SamudraPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(true); // Default to true to avoid initial blank on mobile
  const [solarLevel, setSolarLevel] = useState(88);
  const [isCharging, setIsCharging] = useState(true);
  const [boxWeight, setBoxWeight] = useState(642);
  const [isBoxActive, setIsBoxActive] = useState(true);
  const [temp, setTemp] = useState(2.4);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const interval = setInterval(() => {
      setSolarLevel(prev => {
        if (isCharging) return prev < 100 ? prev + 1 : 100;
        return prev > 0 ? prev - 1 : 0;
      });
    }, 10000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(interval);
    };
  }, [isCharging]);

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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Solar & Signal */}
      <section className="grid grid-cols-2 gap-4">
        <div
          className="bg-[#151518] border border-white/5 p-4 rounded-3xl relative overflow-hidden active:scale-95 transition-transform cursor-pointer"
          onClick={() => setIsCharging(!isCharging)}
        >
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
            <span className="text-2xl font-bold">{solarLevel}%</span>
            <span className={`text-[10px] mb-1 font-bold ${isCharging ? 'text-green-500 animate-pulse' : 'text-gray-500'}`}>
              {isCharging ? 'Charging' : 'Standby'}
            </span>
          </div>
          <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F9CB43] rounded-full transition-all duration-1000"
              style={{ width: `${solarLevel}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-[#151518] border border-white/5 p-4 rounded-3xl relative overflow-hidden active:scale-95 transition-transform cursor-pointer">
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

      {/* Fish Box Indicator */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">Penyimpanan Ikan</h2>
          <span className="text-xs text-[#705EBC] font-bold">Box Indikator #01</span>
        </div>

        <div className={`bg-gradient-to-br from-[#151518] to-[#0A0A0B] border transition-all duration-500 rounded-[2rem] p-6 shadow-2xl ${isBoxActive ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status Tangkapan</p>
              <h3 className="text-2xl font-bold text-white">{isBoxActive ? (temp < 10 ? 'Sangat Layak' : 'Harus Segera') : 'System Offline'}</h3>
            </div>
            <button
              onClick={() => setIsBoxActive(!isBoxActive)}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${isBoxActive ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}
            >
              {isBoxActive ? 'Fresh' : 'Inactive'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <Weight size={20} className="text-[#705EBC]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Berat</p>
                <div className="flex items-center gap-2">
                   <button onClick={() => setBoxWeight(w => Math.max(0, w-1))} className="text-gray-500 active:text-white p-1"><Minus size={14}/></button>
                   <p className="text-lg font-bold min-w-[50px] text-center">{boxWeight} kg</p>
                   <button onClick={() => setBoxWeight(w => Math.min(1000, w+1))} className="text-gray-500 active:text-white p-1"><Plus size={14}/></button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <Activity size={20} className="text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Suhu Box</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setTemp(t => parseFloat((t - 0.1).toFixed(1)))} className="text-gray-500 active:text-white p-1"><Minus size={14}/></button>
                  <p className={`text-lg font-bold min-w-[50px] text-center ${temp > 10 ? 'text-red-400' : 'text-white'}`}>{temp}°C</p>
                  <button onClick={() => setTemp(t => parseFloat((t + 0.1).toFixed(1)))} className="text-gray-500 active:text-white p-1"><Plus size={14}/></button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Kesehatan</p>
                <p className="text-lg font-bold">{isBoxActive ? 'Optimal' : '-'}</p>
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
              <span className="text-white font-bold">{boxWeight} / 1000 kg</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#705EBC] to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(boxWeight/1000)*100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Grid */}
      <section className="grid grid-cols-2 gap-4 pb-12">
        <div className="bg-[#151518] p-4 rounded-3xl border border-white/5 active:scale-95 transition-transform cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Cloud size={20} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">CUACA</span>
          </div>
          <p className="text-2xl font-bold">28°C</p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Cerah Berawan</p>
        </div>

        <div className="bg-[#151518] p-4 rounded-3xl border border-white/5 relative overflow-hidden active:scale-95 transition-transform cursor-pointer" onClick={() => setActiveTab('map')}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#705EBC]/10 rounded-xl">
              <MapPin size={20} className="text-[#705EBC]" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">LOKASI</span>
          </div>
          <p className="text-sm font-bold leading-tight">Zona C-12 <br/><span className="text-[#705EBC]">Banyak Ikan</span></p>
        </div>
      </section>
    </div>
  );

  const renderMap = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Radar Lokasi Ikan</h2>
      <div className="aspect-square w-full bg-[#151518] rounded-[2rem] border border-white/5 relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(112,94,188,0.1)_0%,transparent_70%)]"></div>
         {/* Radar Sweeper */}
         <div className="absolute w-[200%] h-[200%] bg-gradient-to-tr from-[#705EBC]/20 to-transparent origin-center animate-spin-slow" style={{ animationDuration: '4s', clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }}></div>
         {/* Grid Circles */}
         <div className="absolute w-[80%] h-[80%] border border-white/5 rounded-full"></div>
         <div className="absolute w-[60%] h-[60%] border border-white/5 rounded-full"></div>
         <div className="absolute w-[40%] h-[40%] border border-white/5 rounded-full"></div>
         {/* Fish Blips */}
         <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
         <div className="absolute top-[60%] left-[70%] w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-700 shadow-[0_0_10px_#60a5fa]"></div>

         <Navigation2 size={32} className="text-white relative z-10" />
      </div>
      <div className="bg-[#151518] p-4 rounded-2xl border border-white/5">
        <p className="text-xs text-gray-500 font-bold uppercase mb-2">Saran Lokasi</p>
        <p className="text-sm font-medium">Bergerak 12 mil laut ke arah <span className="text-[#705EBC]">Barat Laut</span> untuk zona tangkapan optimal.</p>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Harga Pasar</h2>
        <TrendingUp size={20} className="text-green-500" />
      </div>
      <div className="space-y-4">
        {[
          { name: 'Tuna Mata Besar', price: 'Rp 120k', trend: '+5.2%', up: true },
          { name: 'Cakalang', price: 'Rp 45k', trend: '+2.1%', up: true },
          { name: 'Tongkol', price: 'Rp 32k', trend: '-0.8%', up: false },
        ].map((fish, i) => (
          <div key={i} className="bg-[#151518] p-5 rounded-3xl border border-white/5 flex justify-between items-center">
            <div>
              <h4 className="font-bold">{fish.name}</h4>
              <p className="text-xs text-gray-500">Per Kilogram</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black">{fish.price}</p>
              <p className={`text-xs font-bold ${fish.up ? 'text-green-500' : 'text-red-500'}`}>{fish.trend}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInfo = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Informasi Sistem</h2>
      <div className="bg-[#151518] p-6 rounded-3xl border border-white/5 space-y-4">
        <p className="text-gray-400 text-sm">SAMUDRA adalah sistem informasi nelayan terintegrasi.</p>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-sm"><CheckCircle size={16} className="text-[#705EBC]"/> Pelacakan Lokasi Ikan</li>
          <li className="flex items-center gap-3 text-sm"><CheckCircle size={16} className="text-[#705EBC]"/> Ramalan Cuaca Real-time</li>
          <li className="flex items-center gap-3 text-sm"><CheckCircle size={16} className="text-[#705EBC]"/> Update Harga Pasar</li>
          <li className="flex items-center gap-3 text-sm"><CheckCircle size={16} className="text-[#705EBC]"/> Manajemen Solar Panel</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] text-white font-sans flex flex-col overflow-hidden z-[100]">
      <div className="h-6 w-full bg-[#0A0A0B]"></div>

      {/* App Bar */}
      <header className="px-6 py-4 flex justify-between items-center bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => onNavigate('xoeris')} className="p-2 -ml-2 text-gray-400 hover:text-white active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-black tracking-widest text-[#705EBC]">SAMUDRA</h1>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBoxActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">System {isBoxActive ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 active:scale-90 transition-transform">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-400 active:scale-90 transition-transform">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pt-4 pb-32 overflow-y-auto no-scrollbar">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'market' && renderMarket()}
        {activeTab === 'info' && renderInfo()}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0A0A0B]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-[110] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-[#705EBC] scale-110' : 'text-gray-500 opacity-60'}`}
        >
          <Activity size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Status</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'map' ? 'text-[#705EBC] scale-110' : 'text-gray-500 opacity-60'}`}
        >
          <MapPin size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Radar</span>
        </button>

        {/* Center Floating Button */}
        <div className="relative -top-8 group">
          <div className="absolute inset-0 bg-[#705EBC] blur-2xl opacity-20 group-active:opacity-40 transition-opacity"></div>
          <button
             onClick={() => setIsBoxActive(!isBoxActive)}
             className={`p-5 rounded-[2rem] shadow-2xl relative transition-all duration-500 active:scale-90 ${isBoxActive ? 'bg-gradient-to-tr from-[#705EBC] to-blue-500' : 'bg-gray-800 grayscale'}`}
          >
            <Power size={32} className="text-white" />
          </button>
        </div>

        <button
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'market' ? 'text-[#705EBC] scale-110' : 'text-gray-500 opacity-60'}`}
        >
          <TrendingUp size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Market</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'info' ? 'text-[#705EBC] scale-110' : 'text-gray-500 opacity-60'}`}
        >
          <Info size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Info</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
