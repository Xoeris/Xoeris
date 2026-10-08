import React, { useState, useEffect } from 'react';
import AcelbytePage from './AcelbytePage';
import AboutPage from './AboutPage';
import ChatPage from './ChatPage';
import ErrorPage from './ErrorPage';
import UnderConstructionPage from './UnderConstructionPage';
import XalmeMainPage from './XalmeMainPage';
import DigitalArtifactsPage from './DigitalArtifactsPage';
import XoerisPage from './XoerisPage';
import SamudraPage from './SamudraPage';
import TartarugaPage from './TartarugaPage';
import SubscriptionsPage from './SubscriptionsPage';
import AureviaPage from './AureviaPage';
import AuthPage from './AuthPage';

// Product Deep-Dive Pages
import VocalisProductPage from './VocalisProductPage';
import CoreAProductPage from './CoreAProductPage';
import CoreAProductPage from './CoreAProductPage';

// Support Hubs
import DeveloperPortal from './DeveloperPortal';

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

/* HIDE Design System brand colors — used for background blobs */
const colors = {
  bg: '#161616',            // color.background.canvas
  amber: '#FFC94A',         // color.accent.primary
  amberDeep: '#FFB020',     // color.accent.primary-deep
  teal: '#00C896',          // color.action.primary
  text: '#E0E0E8',          // color.text.primary
  textMuted: '#7E7E8C'      // color.text.muted
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
      return 'xalme-main';
    }

    if (hostname.includes('tartaruga') || path.startsWith('/tartaruga')) return 'tartaruga';
    if (path.startsWith('/aurevia') || path.startsWith('/search')) return 'aurevia';
    if (path === '/digital-artifacts') return 'digital-artifacts';
    if (path === '/about/acelbyte' || path === '/acelbyte') return 'acelbyte';
    if (path === '/about') return 'about';
    if (path === '/chat') return 'chat';

    if (path === '/subscription' || path === '/payment') return 'subscriptions';
    if (path === '/developers') return 'developers';

    if (path.startsWith('/ariasphere/vocalis')) return 'ariasphere-vocalis';
    if (path.startsWith('/zenith/corea')) return 'zenith-corea';

    return 'xoeris';
  });

  useEffect(() => {
    // Auto-redirect /xoeris to /
    const path = window.location.pathname.toLowerCase();
    if (path === '/xoeris') {
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
          setCurrentPage('xalme-main');
        }
        return;
      }

      if (path === '/developers') setCurrentPage('developers');
      else if (path.includes('/ariasphere/vocalis')) setCurrentPage('ariasphere-vocalis');
      else if (path.includes('/zenith/corea')) setCurrentPage('zenith-corea');
      else if (path === '/xoeris') setCurrentPage('xoeris');
      else if (path === '/about') setCurrentPage('about');
      else if (path === '/chat') setCurrentPage('chat');
      else if (path === '/about/acelbyte' || path === '/acelbyte') setCurrentPage('acelbyte');
      else if (path === '/tartaruga') setCurrentPage('tartaruga');
      else if (path === '/digital-artifacts') setCurrentPage('digital-artifacts');
      else if (path === '/subscription') setCurrentPage('subscriptions');
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
      acelbyte: 'Acelbyte',
      xoeris: 'Xoeris',
      about: 'About | Xoeris',
      chat: 'Xalme Chat | Xoeris',
      'xalme-main': 'Xalme AI | Xoeris',
      'under-construction': 'Under Construction | Xoeris',
      'error-api': 'Restricted Endpoint | Xoeris',
      'error-dl': 'Restricted Storage | Xoeris',
      developers: 'Developer Portal | Xoeris',
      'ariasphere-vocalis': 'Xoeris Vocalis',
      'zenith-corea': 'Xoeris Core-A',
      subscriptions: 'Subscription | Xoeris',
      'digital-artifacts': 'Digital Artifacts | Acelbyte'
    };

    const icons = {
      auth: '/xoeris_logo_color.png',
      aurevia: '/xoeris_logo_color.png',
      acelbyte: '/acelbyte-logo.png',
      xoeris: '/xoeris_logo_color.png',
      developers: '/xoeris_logo_color.png',
      'ariasphere-vocalis': '/xoeris_logo_color.png',
      'zenith-corea': '/xoeris_logo_color.png',
      subscriptions: '/xoeris_logo_color.png',
      'digital-artifacts': '/acelbyte-logo.png',
      tartaruga: '/tartaruga-logo.png'
    };

    document.title = titles[currentPage] || 'Xoeris';

    // Update Favicon
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = icons[currentPage] || '/xoeris_logo_color.png';
    }
  }, [currentPage]);

  const handleNavigate = (page) => {
    const pathMap = {
      aurevia: '/aurevia',
      about: '/about',
      chat: '/chat',
      acelbyte: '/about/acelbyte',
      xoeris: '/',
      developers: '/developers',
      'ariasphere-vocalis': '/ariasphere/vocalis',
      'zenith-corea': '/zenith/corea',
      subscriptions: '/subscription',
      'digital-artifacts': '/digital-artifacts'
    };

    const newPath = pathMap[page] || '/';
    const finalPath = (newPath === '/xoeris') ? '/' : newPath;

    window.history.pushState({}, '', finalPath);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen font-ui relative z-0 overflow-x-hidden bg-hide-canvas text-hide-text-primary">
      {!['acelbyte', 'digital-artifacts', 'subscriptions', 'samudra-showcase', 'aurevia', 'auth'].includes(currentPage) && (
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden opacity-40">
          {/* HIDE brand blobs: amber + deep-amber + teal */}
          <div className="blob blob-1" style={{ backgroundColor: colors.amber }}></div>
          <div className="blob blob-2" style={{ backgroundColor: colors.amberDeep }}></div>
          <div className="blob blob-3" style={{ backgroundColor: colors.teal }}></div>
          <div className="absolute inset-0 bg-hide-canvas/40 backdrop-blur-[100px]"></div>
        </div>
      )}

      <div key={currentPage}>
        {currentPage === 'auth' && <AuthPage />}
        {currentPage === 'aurevia' && <AureviaPage onNavigate={handleNavigate} />}
        {currentPage === 'acelbyte' && <AcelbytePage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'chat' && <ChatPage onNavigate={handleNavigate} />}
        {currentPage === 'xalme-main' && <XalmeMainPage onNavigate={handleNavigate} />}
        {currentPage === 'under-construction' && <UnderConstructionPage />}
        {currentPage === 'error-api' && <ErrorPage title="Restricted API Endpoint" />}
        {currentPage === 'error-dl' && <ErrorPage title="Restricted Private Storage" />}
        {currentPage === 'xoeris' && <XoerisPage onNavigate={handleNavigate} />}
        {currentPage === 'tartaruga' && <TartarugaPage onNavigate={handleNavigate} />}
        {currentPage === 'subscriptions' && <SubscriptionsPage onNavigate={handleNavigate} />}
        {currentPage === 'digital-artifacts' && <DigitalArtifactsPage onNavigate={handleNavigate} />}

        {/* Product Details */}
        {currentPage === 'ariasphere-vocalis' && <VocalisProductPage onNavigate={handleNavigate} />}
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
