import React, { useState, useEffect } from 'react';
import AcelbytePage from './AcelbytePage';
import DigitalArtifactsPage from './DigitalArtifactsPage';
import LoomaPage from './LoomaPage';
import XoerisPage from './XoerisPage';
import SamudraPage from './SamudraPage';
import TartarugaPage from './TartarugaPage';
import SubscriptionsPage from './SubscriptionsPage';

// SAMUDRA Pages
import SamudraShowcasePage from './SamudraShowcasePage';

// Family Pages
import NetwavePage from './NetwavePage';
import AriaspherePage from './AriaspherePage';
import IllucinePage from './IllucinePage';
import ElarionPage from './ElarionPage';
import AetherisPage from './AetherisPage';
import VoltrixPage from './VoltrixPage';
import ZenithPage from './ZenithPage';

// Product Deep-Dive Pages
import HorizoneProductPage from './HorizoneProductPage';
import ACTONProductPage from './ACTONProductPage';
import AmberlordProductPage from './AmberlordProductPage';
import XESCProductPage from './XESCProductPage';
import DrivonProductPage from './DrivonProductPage';
import AetherOSProductPage from './AetherOSProductPage';
import VocalisProductPage from './VocalisProductPage';
import PrismProductPage from './PrismProductPage';
import NodeSProductPage from './NodeSProductPage';
import CoreAProductPage from './CoreAProductPage';

// Support Hubs
import DeveloperPortal from './DeveloperPortal';

const PlaceholderProduct = ({ title, onNavigate }) => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 text-center">
    <div className="w-20 h-20 bg-white/5 rounded-3xl mb-10 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-[#705EBC] animate-ping"></div>
    </div>
    <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase">{title}</h1>
    <p className="text-xl text-gray-400 max-w-lg mb-10">Product technical synchronization in progress. Node access pending.</p>
    <button onClick={() => onNavigate('xoeris')} className="px-8 py-3 bg-white text-black rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform">Return to Core</button>
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

    if (hostname.includes('xoeris') || path.startsWith('/xoeris') || path !== '/') {
      if (path === '/subscription' || path === '/payment') return 'subscriptions';
      if (path === '/developers') return 'developers';

      if (path.startsWith('/netwave')) {
        if (path.includes('/nodes')) return 'netwave-nodes';
        return 'netwave';
      }
      if (path.startsWith('/ariasphere')) {
        if (path.includes('/vocalis')) return 'ariasphere-vocalis';
        return 'ariasphere';
      }
      if (path.startsWith('/illucine')) {
        if (path.includes('/prism')) return 'illucine-prism';
        return 'illucine';
      }
      if (path.startsWith('/aetheris')) {
        if (path.includes('/xesc')) return 'aetheris-xesc';
        if (path.includes('/drivon')) return 'aetheris-drivon';
        if (path.includes('/aetheros')) return 'aetheris-aetheros';
        return 'aetheris';
      }
      if (path.startsWith('/elarion')) {
        if (path.includes('/horizone')) return 'elarion-horizone';
        if (path.includes('/acton')) return 'elarion-acton';
        if (path.includes('/amberlord')) return 'elarion-amberlord';
        return 'elarion';
      }
      if (path.startsWith('/voltrix')) {
        if (path.includes('/samudra/showcase')) return 'samudra-showcase';
        if (path.includes('/samudra')) return 'samudra';
        return 'voltrix';
      }
      if (path.startsWith('/zenith')) {
        if (path.includes('/corea')) return 'zenith-corea';
        return 'zenith';
      }

      return 'xoeris';
    }

    return 'acelbyte';
  });

  useEffect(() => {
    // Auto-redirect /xoeris to / when on the xoeris subdomain
    const path = window.location.pathname.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes('xoeris') && path === '/xoeris') {
      window.history.replaceState({}, '', '/');
    }

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/developers') setCurrentPage('developers');
      else if (path.startsWith('/netwave')) {
        if (path.includes('/nodes')) setCurrentPage('netwave-nodes');
        else setCurrentPage('netwave');
      }
      else if (path.startsWith('/ariasphere')) {
        if (path.includes('/vocalis')) setCurrentPage('ariasphere-vocalis');
        else setCurrentPage('ariasphere');
      }
      else if (path.startsWith('/illucine')) {
        if (path.includes('/prism')) setCurrentPage('illucine-prism');
        else setCurrentPage('illucine');
      }
      else if (path.startsWith('/aetheris')) {
        if (path.includes('/xesc')) setCurrentPage('aetheris-xesc');
        else if (path.includes('/drivon')) setCurrentPage('aetheris-drivon');
        else if (path.includes('/aetheros')) setCurrentPage('aetheris-aetheros');
        else setCurrentPage('aetheris');
      }
      else if (path.startsWith('/elarion')) {
        if (path.includes('/horizone')) setCurrentPage('elarion-horizone');
        else if (path.includes('/acton')) setCurrentPage('elarion-acton');
        else if (path.includes('/amberlord')) setCurrentPage('elarion-amberlord');
        else setCurrentPage('elarion');
      }
      else if (path.startsWith('/voltrix')) {
        if (path.includes('/samudra/showcase')) setCurrentPage('samudra-showcase');
        else if (path.includes('/samudra')) setCurrentPage('samudra');
        else setCurrentPage('voltrix');
      }
      else if (path.startsWith('/zenith')) {
        if (path.includes('/corea')) setCurrentPage('zenith-corea');
        else setCurrentPage('zenith');
      }
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
      developers: 'Developer Portal | Xoeris',
      netwave: 'Xoeris Netwave',
      'netwave-nodes': 'Xoeris Node-S',
      ariasphere: 'Xoeris Ariasphere',
      'ariasphere-vocalis': 'Xoeris Vocalis',
      illucine: 'Xoeris Illucine',
      'illucine-prism': 'Xoeris Prism',
      elarion: 'Xoeris Elarion',
      'elarion-horizone': 'Xoeris Horizone',
      'elarion-acton': 'Xoeris ACTON',
      'elarion-amberlord': 'Amberlord',
      aetheris: 'Xoeris Aetheris',
      'aetheris-xesc': 'XESC',
      'aetheris-drivon': 'Xoeris Drivon',
      'aetheris-aetheros': 'Aether OS',
      voltrix: 'Xoeris Voltrix',
      samudra: 'SAMUDRA | Xoeris',
      'samudra-showcase': 'SAMUDRA Showcase',
      zenith: 'Xoeris Zenith',
      'zenith-corea': 'Xoeris Core-A',
      subscriptions: 'Subscription | Xoeris',
      'digital-artifacts': 'Digital Artifacts | Acelbyte'
    };

    const icons = {
      acelbyte: '/acelbyte-logo.png',
      looma: '/looma-studio-logo.png',
      xoeris: '/xoeris-logo.png',
      developers: '/xoeris-logo.png',
      netwave: '/xoeris-logo.png',
      'netwave-nodes': '/xoeris-logo.png',
      ariasphere: '/xoeris-logo.png',
      'ariasphere-vocalis': '/xoeris-logo.png',
      illucine: '/xoeris_illucine_logo_icon_2026.png',
      'illucine-prism': '/xoeris_illucine_logo_icon_2026.png',
      elarion: '/xoeris_elarion_logo_colored.png',
      'elarion-horizone': '/xoeris_voltrix_horizone_logo_icon_colored.png',
      'elarion-acton': '/xoeris_elarion_logo_colored.png',
      'elarion-amberlord': '/xoeris_elarion_logo_colored.png',
      aetheris: '/xoeris_aetherislogo.png',
      'aetheris-xesc': '/xesc_icon.png',
      'aetheris-drivon': '/xoeris_aetherislogo.png',
      'aetheris-aetheros': '/xoeris_aetherislogo.png',
      voltrix: '/xoeris_voltrix_logo_icon_2026.png',
      samudra: '/xoeris_voltrix_logo_icon_2026.png',
      'samudra-showcase': '/xoeris_voltrix_logo_icon_2026.png',
      zenith: '/xoeris-logo.png',
      'zenith-corea': '/xoeris-logo.png',
      subscriptions: '/xoeris-logo.png',
      'digital-artifacts': '/acelbyte-logo.png',
      tartaruga: '/tartaruga-logo.png'
    };

    document.title = titles[currentPage] || 'Xoeris';

    // Update Favicon
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = icons[currentPage] || '/acelbyte-logo.png';
    }
  }, [currentPage]);

  const handleNavigate = (page) => {
    const pathMap = {
      acelbyte: '/',
      looma: '/loomastudio',
      xoeris: '/xoeris',
      developers: '/developers',
      netwave: '/netwave',
      'netwave-nodes': '/netwave/nodes',
      ariasphere: '/ariasphere',
      'ariasphere-vocalis': '/ariasphere/vocalis',
      illucine: '/illucine',
      'illucine-prism': '/illucine/prism',
      elarion: '/elarion',
      'elarion-horizone': '/elarion/horizone',
      'elarion-acton': '/elarion/acton',
      'elarion-amberlord': '/elarion/amberlord',
      aetheris: '/aetheris',
      'aetheris-xesc': '/aetheris/xesc',
      'aetheris-drivon': '/aetheris/drivon',
      'aetheris-aetheros': '/aetheris/aetheros',
      voltrix: '/voltrix',
      samudra: '/voltrix/samudra/app',
      'samudra-showcase': '/voltrix/samudra/showcase',
      zenith: '/zenith',
      'zenith-corea': '/zenith/corea',
      subscriptions: '/subscription',
      'digital-artifacts': '/digital-artifacts'
    };

    const newPath = pathMap[page] || '/';

    // Auto-clean path for xoeris subdomain
    const finalPath = (window.location.hostname.includes('xoeris') && newPath === '/xoeris') ? '/' : newPath;

    window.history.pushState({}, '', finalPath);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen font-sans relative z-0 overflow-x-hidden bg-black text-white">
      {!['acelbyte', 'digital-artifacts', 'subscriptions', 'samudra-showcase'].includes(currentPage) && (
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden opacity-40">
          <div className="blob blob-1" style={{ backgroundColor: colors.yellow }}></div>
          <div className="blob blob-2" style={{ backgroundColor: colors.coral }}></div>
          <div className="blob blob-3" style={{ backgroundColor: colors.violet }}></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px]"></div>
        </div>
      )}

      <div key={currentPage}>
        {currentPage === 'acelbyte' && <AcelbytePage onNavigate={handleNavigate} />}
        {currentPage === 'looma' && <LoomaPage onNavigate={handleNavigate} />}
        {currentPage === 'xoeris' && <XoerisPage onNavigate={handleNavigate} />}
        {currentPage === 'samudra' && <SamudraPage onNavigate={handleNavigate} />}
        {currentPage === 'samudra-showcase' && <SamudraShowcasePage onNavigate={handleNavigate} />}
        {currentPage === 'tartaruga' && <TartarugaPage onNavigate={handleNavigate} />}
        {currentPage === 'subscriptions' && <SubscriptionsPage onNavigate={handleNavigate} />}
        {currentPage === 'digital-artifacts' && <DigitalArtifactsPage onNavigate={handleNavigate} />}

        {/* Family Hubs */}
        {currentPage === 'netwave' && <NetwavePage onNavigate={handleNavigate} />}
        {currentPage === 'ariasphere' && <AriaspherePage onNavigate={handleNavigate} />}
        {currentPage === 'illucine' && <IllucinePage onNavigate={handleNavigate} />}
        {currentPage === 'elarion' && <ElarionPage onNavigate={handleNavigate} />}
        {currentPage === 'aetheris' && <AetherisPage onNavigate={handleNavigate} />}
        {currentPage === 'voltrix' && <VoltrixPage onNavigate={handleNavigate} />}
        {currentPage === 'zenith' && <ZenithPage onNavigate={handleNavigate} />}

        {/* Product Details */}
        {currentPage === 'elarion-horizone' && <HorizoneProductPage onNavigate={handleNavigate} />}
        {currentPage === 'elarion-acton' && <ACTONProductPage onNavigate={handleNavigate} />}
        {currentPage === 'elarion-amberlord' && <AmberlordProductPage onNavigate={handleNavigate} />}
        {currentPage === 'aetheris-xesc' && <XESCProductPage onNavigate={handleNavigate} />}
        {currentPage === 'aetheris-drivon' && <DrivonProductPage onNavigate={handleNavigate} />}
        {currentPage === 'aetheris-aetheros' && <AetherOSProductPage onNavigate={handleNavigate} />}
        {currentPage === 'ariasphere-vocalis' && <VocalisProductPage onNavigate={handleNavigate} />}
        {currentPage === 'illucine-prism' && <PrismProductPage onNavigate={handleNavigate} />}
        {currentPage === 'netwave-nodes' && <NodeSProductPage onNavigate={handleNavigate} />}
        {currentPage === 'zenith-corea' && <CoreAProductPage onNavigate={handleNavigate} />}

        {/* Support Hubs */}
        {currentPage === 'developers' && <DeveloperPortal onNavigate={handleNavigate} />}
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
