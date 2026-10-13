import React, { useState, useEffect } from 'react';
import AboutPage from './AboutPage';
import ChatPage from './ChatPage';
import ErrorPage from './ErrorPage';
import UnderConstructionPage from './UnderConstructionPage';
import XalmeMainPage from './XalmeMainPage';
import XoerisPage from './XoerisPage';
import SubscriptionsPage from './SubscriptionsPage';
import AureviaPage from './AureviaPage';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';
import { setSession, syncUserFromDatabase } from './services/authService';

// Product Deep-Dive Pages
import VocalisProductPage from './VocalisProductPage';
import APEX from './APEX';
import HorizoneEngine from './HorizoneEngine';
import HorizoneIDE from './HorizoneIDE';
import MOVA from './MOVA';
import Musify from './Musify';
import Xalme from './Xalme';
import XalmeCode from './XalmeCode';

const PlaceholderProduct = ({ title, onNavigate }) => (
  <div className="min-h-screen bg-hide-canvas text-hide-text-primary flex flex-col items-center justify-center p-10 text-center">
    <div className="w-20 h-20 bg-hide-elevated rounded-hide-xl mb-10 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-hide-accent animate-ping"></div>
    </div>
    <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase">{title}</h1>
    <p className="text-xl text-hide-text-muted max-w-lg mb-10">Product technical synchronization in progress. Node access pending.</p>
    <button onClick={() => onNavigate('xoeris')} className="px-8 py-3 bg-hide-action text-hide-action-text rounded-hide-lg font-bold uppercase text-xs tracking-widest hover:bg-hide-action-hover hover:scale-105 transition-all duration-hide-fast">Return to Core</button>
  </div>
);

/* Xoeris Cyber Design System brand colors - used for background blobs */
const colors = {
  bg: '#050505',
  amber: '#FDD935',         // Cyber Yellow
  amberDeep: '#FFC94A',     // Amber Yellow
  teal: '#FEF08A',          // Pale Yellow Glow
  text: '#ffffff',
  textMuted: '#a1a1aa'
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hostname = window.location.hostname;
    const path = window.location.pathname.toLowerCase();

    // Check hostnames first (auth must be before generic checks)
    if (hostname.includes('auth.xoeris.com') || hostname.startsWith('auth.')) return 'auth';
    if (hostname.includes('aurevia.xoeris.com') || hostname.includes('aurevia')) return 'aurevia';
    if (hostname.includes('api.xoeris.com')) return 'error-api';
    if (hostname.includes('dl.private.drive.xoeris.com')) return 'error-dl';
    if (hostname.includes('drive.xoeris.com')) return 'under-construction';
    if (hostname.includes('xalme.xoeris.com')) {
      if (path === '/chat') return 'chat';
      return 'xalme';
    }

    if (hostname.includes('tartaruga') || path.startsWith('/tartaruga') || path === '/developers') {
      window.history.replaceState({}, '', '/');
      return 'xoeris';
    }
    if (path.startsWith('/aurevia') || path.startsWith('/search')) return 'aurevia';
    if (path === '/about/acelbyte' || path === '/acelbyte') {
      window.history.replaceState({}, '', '/');
      return 'xoeris';
    }
    if (path === '/about') return 'about';
    if (path === '/chat') return 'chat';
    if (path === '/login' || path === '/auth') return 'auth';
    if (path === '/admin' || path.startsWith('/admin')) return 'admin';

    if (path === '/pricing' || path === '/subscription' || path === '/subscriptions' || path === '/payment') return 'pricing';

    if (path.startsWith('/ariasphere/vocalis')) return 'ariasphere-vocalis';

    if (path === '/under-construction' || path === '/horizoneengine' || path === '/horizone-engine' || path.startsWith('/horizoneengine') || path.startsWith('/models/') || path === '/elarion' || path === '/nebula' || path === '/forge' || path === '/atlas') return 'under-construction';

    if (path === '/apex' || path.startsWith('/apex')) return 'apex';
    if (path === '/horizoneide' || path === '/horizone-ide' || path.startsWith('/horizoneide')) return 'horizoneide';
    if (path === '/mova' || path.startsWith('/mova')) return 'mova';
    if (path === '/musify' || path.startsWith('/musify')) return 'musify';
    if (path === '/xalme' || path.startsWith('/xalme/about')) {
      if (hostname.includes('xoeris.com') && !hostname.includes('xalme.xoeris.com')) {
        window.location.replace('https://xalme.xoeris.com/');
        return 'xalme';
      }
      return 'xalme';
    }
    if (path === '/xalmecode' || path === '/xalme-code' || path.startsWith('/xalmecode')) return 'xalmecode';

    return 'xoeris';
  });

  useEffect(() => {
    // Capture cross-domain token from auth.xoeris.com
    const searchParams = new URLSearchParams(window.location.search);
    const incomingToken = searchParams.get('token');
    if (incomingToken) {
      setSession(incomingToken, null);
      syncUserFromDatabase().catch(() => null);
      searchParams.delete('token');
      searchParams.delete('auth');
      searchParams.delete('state');
      const cleanSearch = searchParams.toString();
      const cleanUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '') + window.location.hash;
      window.history.replaceState({}, '', cleanUrl);
    } else {
      // Auto-sync session from shared .xoeris.com cookies or stored tokens
      syncUserFromDatabase().catch(() => null);
    }

    // Auto-redirect removed routes to /
    const path = window.location.pathname.toLowerCase();
    if (path === '/xoeris' || path === '/about/acelbyte' || path === '/acelbyte' || path === '/developers' || path === '/tartaruga') {
      window.history.replaceState({}, '', '/');
    }

    const handlePopState = () => {
      const hostname = window.location.hostname;
      const path = window.location.pathname.toLowerCase();

      if (hostname.includes('auth.xoeris.com') || hostname.startsWith('auth.')) {
        setCurrentPage('auth');
        return;
      }
      if (hostname.includes('aurevia.xoeris.com') || hostname.includes('aurevia')) {
        setCurrentPage('aurevia');
        return;
      }
      if (hostname.includes('api.xoeris.com')) {
        setCurrentPage('error-api');
        return;
      }
      if (hostname.includes('dl.private.drive.xoeris.com')) {
        setCurrentPage('error-dl');
        return;
      }
      if (hostname.includes('drive.xoeris.com')) {
        setCurrentPage('under-construction');
        return;
      }
      if (hostname.includes('xalme.xoeris.com')) {
        if (path === '/chat') {
          setCurrentPage('chat');
        } else {
          setCurrentPage('xalme');
        }
        return;
      }

      if (path === '/developers' || path === '/tartaruga' || path === '/about/acelbyte' || path === '/acelbyte') {
        window.history.replaceState({}, '', '/');
        setCurrentPage('xoeris');
      }
      else if (path.includes('/ariasphere/vocalis')) setCurrentPage('ariasphere-vocalis');
      else if (path === '/under-construction' || path === '/horizoneengine' || path === '/horizone-engine' || path.startsWith('/horizoneengine') || path.startsWith('/models/') || path === '/elarion' || path === '/nebula' || path === '/forge' || path === '/atlas') setCurrentPage('under-construction');
      else if (path === '/apex' || path.startsWith('/apex')) setCurrentPage('apex');
      else if (path === '/horizoneide' || path === '/horizone-ide' || path.startsWith('/horizoneide')) setCurrentPage('horizoneide');
      else if (path === '/mova' || path.startsWith('/mova')) setCurrentPage('mova');
      else if (path === '/musify' || path.startsWith('/musify')) setCurrentPage('musify');
      else if (path === '/xalme' || path.startsWith('/xalme/about')) {
        if (hostname.includes('xoeris.com') && !hostname.includes('xalme.xoeris.com')) {
          window.location.replace('https://xalme.xoeris.com/');
          return;
        }
        setCurrentPage('xalme');
      }
      else if (path === '/xalmecode' || path === '/xalme-code' || path.startsWith('/xalmecode')) setCurrentPage('xalmecode');
      else if (path === '/xoeris') setCurrentPage('xoeris');
      else if (path === '/about') setCurrentPage('about');
      else if (path === '/chat') setCurrentPage('chat');
      else if (path === '/login' || path === '/auth') setCurrentPage('auth');
      else if (path === '/admin' || path.startsWith('/admin')) setCurrentPage('admin');
      else if (path === '/pricing' || path === '/subscription' || path === '/subscriptions' || path === '/payment') setCurrentPage('pricing');
      else if (path.startsWith('/aurevia') || path.startsWith('/search')) setCurrentPage('aurevia');
      else setCurrentPage('xoeris');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const titles = {
      auth: 'Xoeris Auth',
      aurevia: 'Aurevia Search',
      xoeris: 'Xoeris',
      about: 'About | Xoeris',
      chat: 'Xalme Chat | Xoeris',
      'xalme-main': 'Xalme AI | Xoeris',
      'under-construction': 'Under Construction | Xoeris',
      'error-api': 'Restricted Endpoint | Xoeris',
      'error-dl': 'Restricted Storage | Xoeris',
      'ariasphere-vocalis': 'Xoeris Vocalis',
      apex: 'APEX | Xoeris',
      horizoneengine: 'Horizone Engine | Xoeris',
      horizoneide: 'Horizone IDE | Xoeris',
      mova: 'MOVA | Xoeris',
      musify: 'Musify | Xoeris',
      xalme: 'Xalme | Xoeris',
      xalmecode: 'Xalme Code | Xoeris',
      admin: 'Admin Dashboard | Xoeris',
      pricing: 'Pricing | Xoeris',
      subscriptions: 'Pricing | Xoeris'
    };

    const icons = {
      auth: '/xoeris_logo_color.png',
      aurevia: '/aurevia_logo_icon.png',
      xoeris: '/xoeris_logo_color.png',
      'ariasphere-vocalis': '/xoeris_logo_color.png',
      apex: '/xoeris_apex_logo_icon.png',
      horizoneengine: '/xoeris_horizone_engine_logo_icon_colored.png',
      horizoneide: '/horizone_ide_icon.png',
      mova: '/xoeris_mova_logo_icon.png',
      musify: '/musify_logo_icon.png',
      xalme: '/xoeris_logo_color.png',
      xalmecode: '/xoeris_logo_color.png',
      pricing: '/xoeris_logo_color.png',
      subscriptions: '/xoeris_logo_color.png',
      admin: '/xoeris_logo_color.png'
    };

    document.title = titles[currentPage] || 'Xoeris';

    // Update Favicon
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = icons[currentPage] || '/xoeris_logo_color.png';
    }
  }, [currentPage]);

  const handleNavigate = (page) => {
    const isXalmeHost = window.location.hostname.includes('xalme.xoeris.com');
    const isXoerisDomain = window.location.hostname.includes('xoeris.com');

    if (page === 'chat' && isXoerisDomain && !isXalmeHost) {
      window.location.href = 'https://xalme.xoeris.com/chat';
      return;
    }

    if (page === 'xalme' && isXoerisDomain && !isXalmeHost) {
      window.location.href = 'https://xalme.xoeris.com/';
      return;
    }

    if (isXalmeHost) {
      if (page === 'xalme') {
        window.history.pushState({}, '', '/');
        setCurrentPage('xalme');
        window.scrollTo(0, 0);
        return;
      }
      if (page === 'chat') {
        window.history.pushState({}, '', '/chat');
        setCurrentPage('chat');
        window.scrollTo(0, 0);
        return;
      }
      if (['xoeris', 'home'].includes(page)) {
        window.location.href = 'https://xoeris.com';
        return;
      }
      if (['pricing', 'subscriptions', 'payment'].includes(page)) {
        window.location.href = 'https://xoeris.com/pricing';
        return;
      }
    }

    if (['under-construction', 'horizoneengine', 'elarion', 'nebula', 'forge', 'atlas'].includes(page.toLowerCase())) {
      window.history.pushState({}, '', '/under-construction');
      setCurrentPage('under-construction');
      window.scrollTo(0, 0);
      return;
    }

    const pathMap = {
      aurevia: '/aurevia',
      about: '/about',
      chat: '/chat',
      auth: '/login',
      login: '/login',
      acelbyte: '/',
      xoeris: '/',
      developers: '/',
      tartaruga: '/',
      'ariasphere-vocalis': '/ariasphere/vocalis',
      apex: '/apex',
      horizoneide: '/horizoneide',
      mova: '/mova',
      musify: '/musify',
      xalme: '/xalme',
      xalmecode: '/xalmecode',
      admin: '/admin',
      pricing: '/pricing',
      subscriptions: '/pricing',
      payment: '/payment'
    };

    const newPath = pathMap[page] || '/';
    const finalPath = (newPath === '/xoeris') ? '/' : newPath;

    window.history.pushState({}, '', finalPath);
    setCurrentPage((page === 'acelbyte' || page === 'developers' || page === 'tartaruga') ? 'xoeris' : (page === 'login' ? 'auth' : page));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen font-ui relative z-0 overflow-x-hidden bg-[#050505] text-white selection:bg-[#FDD935] selection:text-black">
      {!['xoeris', 'subscriptions', 'samudra-showcase', 'aurevia', 'auth', 'apex', 'under-construction', 'admin', 'horizoneide', 'mova', 'musify', 'xalme', 'xalmecode'].includes(currentPage) && (
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
          {/* Xoeris Cyber ambient blobs */}
          <div className="blob blob-1 will-change-transform" style={{ backgroundColor: colors.amber }}></div>
          <div className="blob blob-2 will-change-transform" style={{ backgroundColor: colors.amberDeep }}></div>
          <div className="blob blob-3 will-change-transform" style={{ backgroundColor: colors.teal }}></div>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[100px]"></div>
        </div>
      )}

      <div key={currentPage}>
        {currentPage === 'auth' && <AuthPage onNavigate={handleNavigate} />}
        {currentPage === 'aurevia' && <AureviaPage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'chat' && <ChatPage onNavigate={handleNavigate} />}
        {currentPage === 'xalme-main' && <XalmeMainPage onNavigate={handleNavigate} />}
        {currentPage === 'under-construction' && <UnderConstructionPage onNavigate={handleNavigate} />}
        {currentPage === 'error-api' && <ErrorPage title="Restricted API Endpoint" />}
        {currentPage === 'error-dl' && <ErrorPage title="Restricted Private Storage" />}
        {currentPage === 'xoeris' && <XoerisPage onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}
        {(currentPage === 'pricing' || currentPage === 'subscriptions') && <SubscriptionsPage onNavigate={handleNavigate} />}

        {/* Product Details */}
        {currentPage === 'ariasphere-vocalis' && <VocalisProductPage onNavigate={handleNavigate} />}
        {currentPage === 'apex' && <APEX onNavigate={handleNavigate} />}
        {currentPage === 'horizoneide' && <HorizoneIDE onNavigate={handleNavigate} />}
        {currentPage === 'mova' && <MOVA onNavigate={handleNavigate} />}
        {currentPage === 'musify' && <Musify onNavigate={handleNavigate} />}
        {currentPage === 'xalme' && <Xalme onNavigate={handleNavigate} />}
        {currentPage === 'xalmecode' && <XalmeCode onNavigate={handleNavigate} />}
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
