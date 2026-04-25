import React, { useState, useEffect } from 'react';
import AcelbytePage from './AcelbytePage';
import DigitalArtifactsPage from './DigitalArtifactsPage';
import LoomaPage from './LoomaPage';
import XoerisPage from './XoerisPage';
import TartarugaPage from './TartarugaPage';
import SubscriptionsPage from './SubscriptionsPage';

// Exact colors extracted from the provided image
const colors = {
  bg: '#000000',
  yellow: '#F9CB43',
  coral: '#E88C6D',
  violet: '#705EBC',
  text: '#ffffff',
  textMuted: '#a1a1aa'
};

export default function App() {
  // Initialize state based on current URL path
  const [currentPage, setCurrentPage] = useState(() => {
    const hostname = window.location.hostname;
    const path = window.location.pathname;

    if (hostname.includes('loomastudio.acelbyte.com') || path === '/loomastudio') return 'looma';
    if (hostname.includes('xoeris.acelbyte.com') || path === '/xoeris') return 'xoeris';
    if (hostname.includes('tartaruga.acelbyte.com') || path === '/tartaruga') return 'tartaruga';
    if (path === '/subscriptions' || path === '/payment') return 'subscriptions';
    if (path === '/digital-artifacts') return 'digital-artifacts';
    return 'acelbyte';
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hostname = window.location.hostname;
      const path = window.location.pathname;
      if (hostname.includes('loomastudio.acelbyte.com') || path === '/loomastudio') setCurrentPage('looma');
      else if (hostname.includes('xoeris.acelbyte.com') || path === '/xoeris') setCurrentPage('xoeris');
      else if (hostname.includes('tartaruga.acelbyte.com') || path === '/tartaruga') setCurrentPage('tartaruga');
      else if (path === '/subscriptions' || path === '/payment') setCurrentPage('subscriptions');
      else if (path === '/digital-artifacts') setCurrentPage('digital-artifacts');
      else setCurrentPage('acelbyte');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title and favicon according to the current page
  useEffect(() => {
    const titles = {
      acelbyte: 'Acelbyte',
      looma: 'Looma Studio',
      xoeris: 'Xoeris',
      tartaruga: 'Tartaruga',
      subscriptions: 'Subscriptions | Acelbyte',
      'digital-artifacts': 'Digital Artifacts | Acelbyte'
    };

    const icons = {
      acelbyte: '/acelbyte-logo.png',
      looma: '/looma-studio-logo.png',
      xoeris: '/xoeris-logo.png',
      tartaruga: '/tartaruga-logo.png',
      subscriptions: '/acelbyte-logo.png',
      'digital-artifacts': '/acelbyte-logo.png'
    };

    document.title = titles[currentPage] || 'Acelbyte';
    
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = icons[currentPage] || '/acelbyte-logo.png';
    }
  }, [currentPage]);

  // Custom navigation function to update URL or redirect to subdomains
  const handleNavigate = (page) => {
    const hostname = window.location.hostname;
    const isDevelopment = hostname === 'localhost' || hostname.includes('127.0.0.1');
    
    // Domain mapping
    const domains = {
      acelbyte: 'https://acelbyte.com',
      looma: 'https://loomastudio.acelbyte.com',
      xoeris: 'https://xoeris.acelbyte.com',
      tartaruga: 'https://tartaruga.acelbyte.com'
    };

    // If we're already on the correct subdomain (or in dev), handle internally
    if (isDevelopment) {
      let path = '/';
      if (page === 'looma') path = '/loomastudio';
      else if (page === 'xoeris') path = '/xoeris';
      else if (page === 'tartaruga') path = '/tartaruga';
      else if (page === 'subscriptions') path = '/subscriptions';
      else if (page === 'payment') path = '/payment';
      else if (page === 'digital-artifacts') path = '/digital-artifacts';
      
      window.history.pushState({}, '', path);
      setCurrentPage(page);
      window.scrollTo(0, 0);
      return;
    }

    // Production: Check if we need to redirect to another subdomain
    const currentDomainKey = hostname.includes('loomastudio.acelbyte.com') ? 'looma' : 
                             hostname.includes('xoeris.acelbyte.com') ? 'xoeris' : 
                             hostname.includes('tartaruga.acelbyte.com') ? 'tartaruga' : 'acelbyte';

    if (page !== currentDomainKey && domains[page]) {
      window.location.href = domains[page];
      return;
    }

    // Internal navigation for same domain (like digital-artifacts on acelbyte.com)
    let path = '/';
    if (page === 'digital-artifacts') path = '/digital-artifacts';
    else if (page === 'subscriptions') path = '/subscriptions';
    else if (page === 'payment') path = '/payment';
    else if (page === 'tartaruga') path = '/tartaruga';
    
    window.history.pushState({}, '', path);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getPageTransitionClass = () => {
    return 'animate-page-slide-in';
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#F9CB43] selection:text-black relative z-0 overflow-x-hidden" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* Shared Animated Background Blobs - Only for Looma and Xoeris */}
      {currentPage !== 'acelbyte' && currentPage !== 'digital-artifacts' && (
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden gpu-accel">
          <div className="blob blob-1 will-change-transform" style={{ backgroundColor: colors.yellow }}></div>
          <div className="blob blob-2 will-change-transform" style={{ backgroundColor: colors.coral }}></div>
          <div className="blob blob-3 will-change-transform" style={{ backgroundColor: colors.violet }}></div>
          {/* Glass overlay to smooth out the blur even more */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[60px]"></div>
        </div>
      )}

      {/* Page Routing with Transitions */}
      <div key={currentPage} className={getPageTransitionClass()}>
        {currentPage === 'acelbyte' && <AcelbytePage onNavigate={handleNavigate} />}
        {currentPage === 'looma' && <LoomaPage onNavigate={handleNavigate} />}
        {currentPage === 'xoeris' && <XoerisPage onNavigate={handleNavigate} />}
        {currentPage === 'tartaruga' && <TartarugaPage onNavigate={handleNavigate} />}
        {currentPage === 'subscriptions' && <SubscriptionsPage onNavigate={handleNavigate} />}
        {currentPage === 'digital-artifacts' && <DigitalArtifactsPage onNavigate={handleNavigate} />}
      </div>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pageSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-page-slide-in {
          animation: pageSlideIn 0.5s ease-out forwards;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes blob1 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(30vw, 10vh, 0) scale(1.1); }
          66% { transform: translate3d(-10vw, 20vh, 0) scale(0.9); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes blob2 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(-20vw, -20vh, 0) scale(1.2); }
          66% { transform: translate3d(20vw, -10vh, 0) scale(0.8); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes blob3 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(15vw, -30vh, 0) scale(1.1); }
          66% { transform: translate3d(-15vw, -20vh, 0) scale(1.3); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        .blob {
          position: absolute;
          filter: blur(60px);
          opacity: 0.5;
          border-radius: 50%;
          animation-iteration-count: infinite;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-direction: alternate;
          mix-blend-mode: screen;
          will-change: transform;
        }
        .blob-1 {
          width: 50vw;
          height: 50vw;
          top: -10%;
          left: -10%;
          animation-name: blob1;
          animation-duration: 30s;
        }
        .blob-2 {
          width: 45vw;
          height: 45vw;
          top: 40%;
          right: -10%;
          animation-name: blob2;
          animation-duration: 35s;
        }
        .blob-3 {
          width: 60vw;
          height: 60vw;
          bottom: -20%;
          left: 10%;
          animation-name: blob3;
          animation-duration: 32s;
        }
      `}} />
    </div>
  );
}
