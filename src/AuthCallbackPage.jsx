import React, { useEffect, useState } from 'react';
import { setSession, syncUserFromDatabase } from './services/authService';

function XoerisDiamond() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4" aria-hidden="true">
      <path
        d="M12 2L3 9l9 13 9-13-9-9z"
        fill="#FFC94A"
        stroke="#FFE082"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

export default function AuthCallbackPage({ onNavigate }) {
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [appName, setAppName] = useState('');
  const [deepLink, setDeepLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';
    const state = params.get('state') || '';
    let client = (params.get('client') || '').toLowerCase();
    let portStr = params.get('port') || '';
    const target = params.get('target') || params.get('redirect_uri') || '';

    if (!token) {
      setStatus('error');
      setErrorMsg('No authentication token was provided.');
      return;
    }

    // Save session in browser
    setSession(token, null);
    syncUserFromDatabase().catch(() => null);

    const formatClientName = (c) => {
      if (c === 'musify') return 'Musify';
      if (c === 'apex') return 'APEX';
      if (c === 'horizone' || c === 'horizoneide' || c === 'ide') return 'Horizone IDE';
      if (c === 'hub') return 'Horizone Engine Hub';
      if (c === 'hide') return 'HIDE';
      if (c === 'levelist') return 'Levelist';
      if (c === 'mova') return 'MOVA';
      return 'Xoeris Application';
    };

    const resolveAndNotify = async () => {
      let resolvedTarget = target;
      let resolvedClient = client;

      // If state is present, verify against backend to resolve client and redirect_uri
      if (state) {
        try {
          const res = await fetch(`/api/auth/verify?state=${encodeURIComponent(state)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.client && !resolvedClient) resolvedClient = data.client.toLowerCase();
            if (data.redirect_uri && !resolvedTarget) resolvedTarget = data.redirect_uri;
          }
        } catch {}

        // Consume state
        fetch('/api/auth/consume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state }),
        }).catch(() => null);
      }

      const clientDisplay = formatClientName(resolvedClient);
      setAppName(clientDisplay);

      // Resolve loopback ports
      const ports = [];
      if (portStr) {
        const p = parseInt(portStr, 10);
        if (!isNaN(p)) ports.push(p);
      }

      if (resolvedTarget) {
        const match = resolvedTarget.match(/:([0-9]{4,5})/);
        if (match && match[1]) {
          const p = parseInt(match[1], 10);
          if (!isNaN(p) && !ports.includes(p)) ports.push(p);
        }
      }

      // Default port ranges based on known client applications
      if (resolvedClient === 'musify') {
        for (let p = 34220; p <= 34229; p++) { if (!ports.includes(p)) ports.push(p); }
      } else if (resolvedClient === 'horizone' || resolvedClient === 'horizoneide' || resolvedClient === 'ide') {
        for (let p = 34230; p <= 34239; p++) { if (!ports.includes(p)) ports.push(p); }
      } else if (resolvedClient === 'hub') {
        for (let p = 34240; p <= 34249; p++) { if (!ports.includes(p)) ports.push(p); }
      } else if (resolvedClient === 'apex') {
        for (let p = 34260; p <= 34269; p++) { if (!ports.includes(p)) ports.push(p); }
      } else if (ports.length === 0) {
        // Universal sweep if client is unassigned
        [34220, 34230, 34240, 34260].forEach((p) => { if (!ports.includes(p)) ports.push(p); });
      }

      // Notify local loopback server
      ports.forEach((p) => {
        const loopbackUrl = `http://localhost:${p}/callback/?token=${encodeURIComponent(token)}&state=${encodeURIComponent(state)}&auth=success`;
        fetch(loopbackUrl, { mode: 'no-cors' }).catch(() => null);
        const img = new Image();
        img.src = loopbackUrl;
      });

      // Prepare custom protocol deep link if supported
      if (resolvedClient === 'hide') {
        const link = `hide://auth?token=${encodeURIComponent(token)}&state=${encodeURIComponent(state)}`;
        setDeepLink(link);
        window.location.href = link;
      } else if (resolvedClient === 'musify') {
        setDeepLink(`musify://auth?token=${encodeURIComponent(token)}&state=${encodeURIComponent(state)}`);
      } else if (resolvedClient === 'apex') {
        setDeepLink(`apex://auth?token=${encodeURIComponent(token)}&state=${encodeURIComponent(state)}`);
      }

      setStatus('success');
    };

    resolveAndNotify();
  }, []);

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4 selection:bg-[#FFC94A] selection:text-black">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-[#FFC94A]/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#141419] border border-[#2E2E38] rounded-2xl p-8 shadow-2xl text-center">
        {status === 'processing' && (
          <div>
            <XoerisDiamond />
            <div className="inline-block w-6 h-6 border-2 border-[#FFC94A] border-t-transparent rounded-full animate-spin mb-4" />
            <h1 className="text-xl font-bold tracking-tight mb-2">Connecting to Xoeris...</h1>
            <p className="text-sm text-gray-400">Verifying session and transmitting credentials.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckmarkIcon />
            <h1 className="text-2xl font-bold tracking-tight mb-2">Sign-in successful</h1>
            <p className="text-sm text-gray-300 mb-6">
              Your account has been connected{appName ? ` to ${appName}` : ''}. You can now safely close this browser tab and return to your application.
            </p>

            <div className="flex items-center justify-center gap-2 mb-6 text-xs text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Application synchronized</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {deepLink && (
                <a
                  href={deepLink}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#FFC94A] hover:bg-[#FFE082] text-black font-semibold text-sm transition-colors text-center shadow-lg"
                >
                  Open {appName || 'Application'}
                </a>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-lg bg-[#24242E] hover:bg-[#2E2E3A] border border-[#3A3A48] text-gray-200 text-sm font-medium transition-colors"
              >
                Close Tab
              </button>
              <a
                href="https://xoeris.com"
                className="text-xs text-gray-400 hover:text-gray-200 transition-colors pt-1"
              >
                Return to Xoeris Home
              </a>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400 text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-2">Sign-in Error</h1>
            <p className="text-sm text-gray-400 mb-6">{errorMsg || 'Unable to complete sign-in.'}</p>
            <a
              href="https://auth.xoeris.com"
              className="inline-block py-2.5 px-5 rounded-lg bg-[#FFC94A] hover:bg-[#FFE082] text-black font-semibold text-sm transition-colors"
            >
              Back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
