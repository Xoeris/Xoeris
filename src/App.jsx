import React, { useState, useEffect } from 'react';
import AcelbytePage from './AcelbytePage';
import DigitalArtifactsPage from './DigitalArtifactsPage';
import LoomaPage from './LoomaPage';
import XoerisPage from './XoerisPage';
import SamudraPage from './SamudraPage';
import TartarugaPage from './TartarugaPage';
import SubscriptionsPage from './SubscriptionsPage';

// Placeholder components for new families - will be moved to separate files later
const PlaceholderPage = ({ title, onNavigate }) => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 text-center">
    <h1 className="text-6xl font-black mb-6 tracking-tighter">{title}</h1>
    <p className="text-xl text-gray-400 max-w-lg mb-10">This section of the Xoeris ecosystem is currently under synchronization.</p>
    <button onClick={() => onNavigate('xoeris')} className="px-8 py-3 bg-[#705EBC] rounded-full font-bold">Return to Core</button>
  </div>
);

const colors = {
  bg: '#000000',
  yellow: '#F9CB43',
  coral: '#E88C6D',
  violet: '#705EBC',
  text: '#ffffff',
  textMuted: '#a1a1aa'
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hostname = window.location.hostname;
    const path = window.location.pathname.toLowerCase();

    if (hostname.includes('loomastudio') || path.startsWith('/loomastudio')) return 'looma';
    if (hostname.includes('tartaruga') || path.startsWith('/tartaruga')) return 'tartaruga';
    if (path === '/digital-artifacts') return 'digital-artifacts';

    // Xoeris Ecosystem Routing
    if (hostname.includes('xoeris') || path.startsWith('/xoeris') || path !== '/') {
      if (path === '/subscription' || path === '/payment') return 'subscriptions';

      // Strict Nested Hierarchy
      if (path.startsWith('/netwave')) return 'netwave';
      if (path.startsWith('/ariasphere')) return 'ariasphere';
      if (path.startsWith('/illucine')) return 'illucine';
      if (path.startsWith('/elarion')) {
        if (path.includes('/horizone')) return 'elarion-horizone';
        if (path.includes('/acton')) return 'elarion-acton';
        if (path.includes('/amberlord')) return 'elarion-amberlord';
        return 'elarion';
      }
      if (path.startsWith('/aetheris')) {
        if (path.includes('/xesc')) return 'aetheris-xesc';
        if (path.includes('/drivon')) return 'aetheris-drivon';
        return 'aetheris';
      }
      if (path.startsWith('/voltrix')) {
        if (path.includes('/samudra')) return 'samudra';
        return 'voltrix';
      }
      if (path.startsWith('/zenith')) return 'zenith';

      // Legacy Path Support
      if (path.includes('/voltrix/samudra/app')) return 'samudra';

      return 'xoeris';
    }

    return 'acelbyte';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/netwave')) setCurrentPage('netwave');
      else if (path.startsWith('/ariasphere')) setCurrentPage('ariasphere');
      else if (path.startsWith('/illucine')) setCurrentPage('illucine');
      else if (path.startsWith('/elarion')) {
        if (path.includes('/horizone')) setCurrentPage('elarion-horizone');
        else if (path.includes('/acton')) setCurrentPage('elarion-acton');
        else if (path.includes('/amberlord')) setCurrentPage('elarion-amberlord');
        else setCurrentPage('elarion');
      }
      else if (path.startsWith('/aetheris')) {
        if (path.includes('/xesc')) setCurrentPage('aetheris-xesc');
        else if (path.includes('/drivon')) setCurrentPage('aetheris-drivon');
        else setCurrentPage('aetheris');
      }
      else if (path.startsWith('/voltrix')) {
        if (path.includes('/samudra')) setCurrentPage('samudra');
        else setCurrentPage('voltrix');
      }
      else if (path.startsWith('/zenith')) setCurrentPage('zenith');
      else if (path === '/xoeris') setCurrentPage('xoeris');
      else if (path === '/loomastudio') setCurrentPage('looma');
      else if (path === '/tartaruga') setCurrentPage('tartaruga');
      else if (path === '/digital-artifacts') setCurrentPage('digital-artifacts');
      else if (path === '/subscription') setCurrentPage('subscriptions');
      else setCurrentPage('acelbyte');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const titles = {
      acelbyte: 'Acelbyte',
      looma: 'Looma Studio',
      xoeris: 'Xoeris Ecosystem',
      netwave: 'Xoeris Netwave',
      ariasphere: 'Xoeris Ariasphere',
      illucine: 'Xoeris Illucine',
      elarion: 'Xoeris Elarion',
      'elarion-horizone': 'Xoeris Horizone',
      'elarion-acton': 'Xoeris ACTON',
      'elarion-amberlord': 'Amberlord',
      aetheris: 'Xoeris Aetheris',
      'aetheris-xesc': 'XESC',
      'aetheris-drivon': 'Xoeris Drivon',
      voltrix: 'Xoeris Voltrix',
      samudra: 'SAMUDRA | Xoeris',
      zenith: 'Xoeris Zenith',
      subscriptions: 'Subscription | Xoeris',
      'digital-artifacts': 'Digital Artifacts | Acelbyte'
    };
    document.title = titles[currentPage] || 'Xoeris';
  }, [currentPage]);

  const handleNavigate = (page) => {
    const pathMap = {
      acelbyte: '/',
      looma: '/loomastudio',
      xoeris: '/xoeris',
      netwave: '/netwave',
      ariasphere: '/ariasphere',
      illucine: '/illucine',
      elarion: '/elarion',
      'elarion-horizone': '/elarion/horizone',
      'elarion-acton': '/elarion/acton',
      'elarion-amberlord': '/elarion/amberlord',
      aetheris: '/aetheris',
      'aetheris-xesc': '/aetheris/xesc',
      'aetheris-drivon': '/aetheris/drivon',
      voltrix: '/voltrix',
      samudra: '/voltrix/samudra',
      zenith: '/zenith',
      subscriptions: '/subscription',
      'digital-artifacts': '/digital-artifacts'
    };

    const newPath = pathMap[page] || '/';
    window.history.pushState({}, '', newPath);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen font-sans relative z-0 overflow-x-hidden bg-black text-white">
      {/* Background Blobs for Xoeris Ecosystem */}
      {!['acelbyte', 'digital-artifacts', 'subscriptions'].includes(currentPage) && (
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden opacity-40">
          <div className="blob blob-1" style={{ backgroundColor: colors.yellow }}></div>
          <div className="blob blob-2" style={{ backgroundColor: colors.coral }}></div>
          <div className="blob blob-3" style={{ backgroundColor: colors.violet }}></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px]"></div>
        </div>
      )}

      {/* Routing */}
      <div key={currentPage}>
        {currentPage === 'acelbyte' && <AcelbytePage onNavigate={handleNavigate} />}
        {currentPage === 'looma' && <LoomaPage onNavigate={handleNavigate} />}
        {currentPage === 'xoeris' && <XoerisPage onNavigate={handleNavigate} />}
        {currentPage === 'samudra' && <SamudraPage onNavigate={handleNavigate} />}
        {currentPage === 'tartaruga' && <TartarugaPage onNavigate={handleNavigate} />}
        {currentPage === 'subscriptions' && <SubscriptionsPage onNavigate={handleNavigate} />}
        {currentPage === 'digital-artifacts' && <DigitalArtifactsPage onNavigate={handleNavigate} />}

        {/* Family Hubs */}
        {currentPage === 'netwave' && <PlaceholderPage title="NETWAVE" onNavigate={handleNavigate} />}
        {currentPage === 'ariasphere' && <PlaceholderPage title="ARIASPHERE" onNavigate={handleNavigate} />}
        {currentPage === 'illucine' && <PlaceholderPage title="ILLUCINE" onNavigate={handleNavigate} />}
        {currentPage === 'elarion' && <PlaceholderPage title="ELARION" onNavigate={handleNavigate} />}
        {currentPage === 'aetheris' && <PlaceholderPage title="AETHERIS" onNavigate={handleNavigate} />}
        {currentPage === 'voltrix' && <PlaceholderPage title="VOLTRIX" onNavigate={handleNavigate} />}
        {currentPage === 'zenith' && <PlaceholderPage title="ZENITH" onNavigate={handleNavigate} />}

        {/* Product Details */}
        {currentPage === 'elarion-horizone' && <PlaceholderPage title="HORIZONE" onNavigate={handleNavigate} />}
        {currentPage === 'elarion-acton' && <PlaceholderPage title="ACTON" onNavigate={handleNavigate} />}
        {currentPage === 'elarion-amberlord' && <PlaceholderPage title="AMBERLORD" onNavigate={handleNavigate} />}
        {currentPage === 'aetheris-xesc' && <PlaceholderPage title="XESC" onNavigate={handleNavigate} />}
        {currentPage === 'aetheris-drivon' && <PlaceholderPage title="DRIVON" onNavigate={handleNavigate} />}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .blob { position: absolute; filter: blur(80px); opacity: 0.6; border-radius: 50%; animation: blob-anim 20s infinite alternate; }
        @keyframes blob-anim { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(20vw, 10vh) scale(1.2); } }
        .blob-1 { width: 60vw; height: 60vw; top: -10%; left: -10%; }
        .blob-2 { width: 50vw; height: 50vw; bottom: -10%; right: -10%; animation-delay: -5s; }
        .blob-3 { width: 40vw; height: 40vw; top: 30%; left: 30%; animation-delay: -10s; }
      `}} />
    </div>
  );
}
