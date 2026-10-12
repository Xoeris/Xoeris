import React, { useEffect, useState, useRef } from 'react';
import { setSession, syncUserFromDatabase } from './services/authService';

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 10.06.5.09.68-.22.68-.48v-1.7c-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.38 9.38 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.56 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9v2.82c0 .26.18.58.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}
export default function AuthPage({ onNavigate, onSuccess, subheading }) {
  // Guard: allow direct login if accessed on xoeris.com / local web or if valid state param exists
  const [guard, setGuard] = useState({ loading: true, valid: false, error: '', client: '', redirectUri: '' });
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });
  const [otpPending, setOtpPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const params = new URLSearchParams(window.location.search);
  const state = params.get('state');
  const clientParam = params.get('client');
  const redirectParam = params.get('redirect_uri') || params.get('redirect') || params.get('return_to') || params.get('from');
  const [isSignUp, setIsSignUp] = useState(params.get('mode') === 'signup');
  const githubProcessedRef = useRef(false);

  useEffect(() => {
    // Remember where the login originated
    if (redirectParam) {
      sessionStorage.setItem('xoeris_auth_return_to', redirectParam);
    } else if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (!refUrl.hostname.includes('auth.xoeris.com')) {
          sessionStorage.setItem('xoeris_auth_return_to', document.referrer);
        }
      } catch {}
    }

    // Direct navigation is always permitted for web users on any domain
    if (!state) {
      setGuard({
        loading: false,
        valid: true,
        error: '',
        client: clientParam || 'xoeris',
        redirectUri: redirectParam || ''
      });
      return;
    }
    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify?state=${encodeURIComponent(state)}`);
        const data = await res.json();
        if (data.valid) {
          setGuard({ loading: false, valid: true, error: '', client: data.client || clientParam || '', redirectUri: data.redirect_uri || redirectParam || '' });
        } else {
          // Graceful fallback to direct login instead of locking out the user
          setGuard({ loading: false, valid: true, error: '', client: clientParam || 'xoeris', redirectUri: redirectParam || '' });
        }
      } catch (e) {
        setGuard({ loading: false, valid: true, error: '', client: clientParam || 'xoeris', redirectUri: redirectParam || '' });
      }
    };
    verify();
    // GIS script loading
    const loadGis = () => {
      if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.defer = true;
        s.onload = () => window.dispatchEvent(new Event('gsi_loaded'));
        document.head.appendChild(s);
      } else {
        window.dispatchEvent(new Event('gsi_loaded'));
      }
    };
    loadGis();
  }, []);

  useEffect(() => {
    const initAndRender = () => {
      if (guard.valid && window.google?.accounts?.id && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            ux_mode: 'popup',
          });
          const btnContainer = document.getElementById('google-signin-button');
          if (btnContainer) {
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'filled_black',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'center',
              width: Math.min(btnContainer.offsetWidth || 400, 400)
            });
          }
        } catch {}
      }
    };

    initAndRender();
    window.addEventListener('gsi_loaded', initAndRender);
    return () => window.removeEventListener('gsi_loaded', initAndRender);
  }, [guard.valid, guard.redirectUri]);

  const consumeAndRedirect = async (token, user) => {
    if (token) {
      setSession(token, user);
      await syncUserFromDatabase().catch(() => null);
    }
    if (state) {
      try { await fetch('/api/auth/consume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state }) }); } catch {}
    }
    if (onSuccess) {
      onSuccess(token, user);
      return;
    }

    const isAuthSubdomain = window.location.hostname.includes('auth.xoeris.com') || window.location.hostname.startsWith('auth.');
    let target = guard.redirectUri || redirectParam || sessionStorage.getItem('xoeris_auth_return_to');
    sessionStorage.removeItem('xoeris_auth_return_to');

    // For HIDE desktop app
    if (guard.client === 'hide' || clientParam === 'hide') {
      window.location.href = `hide://auth?token=${encodeURIComponent(token || '')}&state=${encodeURIComponent(state || '')}`;
      setTimeout(() => {
        window.location.href = 'https://xoeris.com?auth=success';
      }, 1500);
      return;
    }

    // When on auth.xoeris.com, we must redirect outward to the calling application or xoeris.com
    if (isAuthSubdomain) {
      if (!target || target === '/' || target.includes('auth.xoeris.com')) {
        target = 'https://xoeris.com';
      } else if (target.startsWith('/')) {
        if (target === '/chat') {
          target = 'https://xalme.xoeris.com/chat';
        } else {
          target = `https://xoeris.com${target}`;
        }
      }
      const sep = target.includes('?') ? '&' : '?';
      const tokenParam = token ? `token=${encodeURIComponent(token)}` : '';
      const stParam = state ? `&state=${encodeURIComponent(state)}` : '';
      window.location.href = `${target}${sep}${tokenParam}${stParam}&auth=success`;
      return;
    }

    // When on same origin (e.g. localhost or xoeris.com/login)
    if (target && target.startsWith('/')) {
      const pageKey = target.replace(/^\//, '') || 'xoeris';
      if (onNavigate) {
        onNavigate(pageKey);
      } else {
        window.location.href = target;
      }
      return;
    }

    if (target && (target.startsWith('http://') || target.startsWith('https://'))) {
      const sep = target.includes('?') ? '&' : '?';
      window.location.href = `${target}${sep}token=${encodeURIComponent(token || '')}&auth=success`;
      return;
    }

    if (onNavigate) {
      onNavigate('xoeris');
    } else {
      window.location.href = 'https://xoeris.com?auth=success';
    }
  };

  async function handleGoogleResponse(response) {
    if (!response || !response.credential) {
      setBusy(false);
      setMsg({ text: 'No credential received from Google', isError: true });
      return;
    }
    try {
      setBusy(true);
      setMsg({ text: 'Signing in with Google…', isError: false });
      const apiUrl = window.location.hostname.includes('xoeris.com')
        ? 'https://api.xoeris.com/api/database1/google-login'
        : '/api/database1/google-login';

      let res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      }).catch(() => null);

      if (!res || !res.ok) {
        if (apiUrl !== 'https://api.xoeris.com/api/database1/google-login') {
          res = await fetch('https://api.xoeris.com/api/database1/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential }),
          }).catch(() => null);
        }
      }

      if (res && res.ok) {
        const data = await res.json();
        if (data.token) {
          await consumeAndRedirect(data.token, data.user);
          return;
        }
      }
      const data = res ? await res.json().catch(() => ({})) : {};
      setMsg({ text: data.error || 'Google authentication failed', isError: true });
    } catch (e) {
      setMsg({ text: e.message || 'Google authentication failed', isError: true });
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLoginClick() {
    let cid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!cid) {
      try {
        const apiUrl = window.location.hostname.includes('xoeris.com')
          ? 'https://api.xoeris.com/api/database1/google-config'
          : '/api/database1/google-config';
        const res = await fetch(apiUrl).catch(() => null);
        if (res && res.ok) {
          const cfg = await res.json().catch(() => ({}));
          if (cfg.clientId) cid = cfg.clientId;
        }
      } catch {}
    }
    if (!cid) {
      setMsg({ text: 'Google OAuth not configured (VITE_GOOGLE_CLIENT_ID missing)', isError: true });
      return;
    }

    setBusy(true);
    setMsg({ text: 'Connecting to Google…', isError: false });

    // Wait briefly for GIS if still initializing
    let googleApi = window.google;
    if (!googleApi?.accounts?.id) {
      googleApi = await new Promise((resolve) => {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.google?.accounts?.id) {
            clearInterval(interval);
            resolve(window.google);
          } else if (attempts > 20) {
            clearInterval(interval);
            resolve(null);
          }
        }, 100);
      });
    }

    if (googleApi?.accounts?.id) {
      try {
        googleApi.accounts.id.initialize({
          client_id: cid,
          callback: handleGoogleResponse,
          ux_mode: 'popup',
        });
        googleApi.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setBusy(false);
            const btn = document.querySelector('#google-signin-button [role="button"]') ||
                        document.querySelector('#google-signin-button iframe');
            if (btn) {
              btn.click();
            }
          }
        });
      } catch (err) {
        setBusy(false);
        setMsg({ text: err.message || 'Failed to initialize Google login', isError: true });
      }
    } else {
      // Fallback: direct Google OAuth redirect (bypasses script loading delays and blockers)
      const redirectUri = window.location.origin + '/login';
      const params = new URLSearchParams({
        client_id: cid,
        redirect_uri: redirectUri,
        response_type: 'id_token',
        scope: 'openid email profile',
        nonce: Math.random().toString(36).slice(2),
        prompt: 'select_account',
      });
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }
  }

  async function handleGitHubLogin() {
    let cid = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!cid) {
      try {
        const apiUrl = window.location.hostname.includes('xoeris.com')
          ? 'https://api.xoeris.com/api/database1/github-config'
          : '/api/database1/github-config';
        const res = await fetch(apiUrl).catch(() => null);
        if (res && res.ok) {
          const cfg = await res.json().catch(() => ({}));
          if (cfg.clientId) cid = cfg.clientId;
        }
      } catch {}
    }
    if (!cid) {
      setMsg({ text: 'GitHub OAuth not configured (VITE_GITHUB_CLIENT_ID missing)', isError: true });
      return;
    }
    const redirectUri = window.location.hostname.includes('xoeris.com')
      ? 'https://auth.xoeris.com/github/callback'
      : `${window.location.origin}/github/callback`;
    const params = new URLSearchParams({
      client_id: cid,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      state: state || '',
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }

  async function handleSignUpStep() {
    if (!email || !password) {
      setMsg({ text: 'Email and password required', isError: true });
      return;
    }
    if (password.length < 6) {
      setMsg({ text: 'Password must be at least 6 characters', isError: true });
      return;
    }
    setBusy(true);
    setMsg({ text: '', isError: false });
    try {
      const deviceId = localStorage.getItem('xoeris_device_id') || (() => {
        const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('xoeris_device_id', id);
        return id;
      })();
      const res = await fetch('https://api.xoeris.com/api/database1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Levelist-App-Secret': 'levelist-dev-secret-123' },
        body: JSON.stringify({
          mode: 'signup',
          email,
          username: username.trim(),
          password,
          device_id: deviceId,
          remember_device: true
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        await consumeAndRedirect(data.token, data.user);
      } else {
        setMsg({ text: data.error || 'Registration failed', isError: true });
      }
    } catch (e) {
      setMsg({ text: e.message || 'Registration failed', isError: true });
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordLoginStep() {
    if (!email || !password) {
      setMsg({ text: 'Email and password required', isError: true });
      return;
    }
    setBusy(true);
    setMsg({ text: '', isError: false });
    try {
      const deviceId = localStorage.getItem('xoeris_device_id') || (() => {
        const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('xoeris_device_id', id);
        return id;
      })();
      const res = await fetch('https://api.xoeris.com/api/database1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Levelist-App-Secret': 'levelist-dev-secret-123' },
        body: JSON.stringify({ identifier: email, password, device_id: deviceId, remember_device: true }),
      });
      const data = await res.json();
      if (res.ok && data.require_otp) {
        setPendingEmail(data.email || email);
        setOtpPending(true);
        setMsg({ text: `OTP sent to ${data.email || email}`, isError: false });
      } else if (res.ok && data.token) {
        await consumeAndRedirect(data.token, data.user);
      } else if (res.ok) {
        // fallback if login succeeded without token (trusted device)
        setMsg({ text: data.message || 'Logged in', isError: false });
        if (data.token) await consumeAndRedirect(data.token, data.user);
      } else {
        setMsg({ text: data.error || 'Login failed', isError: true });
      }
    } catch (e) {
      setMsg({ text: e.message, isError: true });
    } finally { setBusy(false); }
  }

  async function handleVerifyOtp() {
    if (!otp || otp.length < 6) {
      setMsg({ text: 'Enter 6-digit OTP', isError: true });
      return;
    }
    setBusy(true);
    try {
      const deviceId = localStorage.getItem('xoeris_device_id') || 'web';
      const res = await fetch('https://api.xoeris.com/api/database1/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Levelist-App-Secret': 'levelist-dev-secret-123' },
        body: JSON.stringify({ email: pendingEmail || email, otp, device_id: deviceId, remember_device: true }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        await consumeAndRedirect(data.token, data.user);
      } else {
        setMsg({ text: data.error || 'OTP verification failed', isError: true });
      }
    } catch (e) {
      setMsg({ text: e.message, isError: true });
    } finally { setBusy(false); }
  }

  // GitHub callback handling
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const code = p.get('code');
    if (window.location.pathname === '/github/callback' && code) {
      if (githubProcessedRef.current) return;
      githubProcessedRef.current = true;
      const st = p.get('state') || state;
      window.history.replaceState({}, '', window.location.pathname);
      (async () => {
        setBusy(true);
        setMsg({ text: 'Verifying GitHub credentials…', isError: false });
        try {
          const redirectUri = window.location.hostname.includes('xoeris.com')
            ? 'https://auth.xoeris.com/github/callback'
            : `${window.location.origin}/github/callback`;
          const apiUrl = window.location.hostname.includes('xoeris.com')
            ? 'https://api.xoeris.com/api/database1/github-login'
            : '/api/database1/github-login';
          let res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirect_uri: redirectUri }),
          }).catch(() => null);

          if (!res || !res.ok) {
            if (apiUrl !== 'https://api.xoeris.com/api/database1/github-login') {
              res = await fetch('https://api.xoeris.com/api/database1/github-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, redirect_uri: redirectUri }),
              }).catch(() => null);
            }
          }

          if (res && res.ok) {
            const data = await res.json();
            if (data.token) {
              await consumeAndRedirect(data.token, data.user);
              return;
            }
          }
          const data = res ? await res.json().catch(() => ({})) : {};
          const errText = data.error || data.error_description || (data.details ? (typeof data.details === 'string' ? data.details : JSON.stringify(data.details)) : 'GitHub login failed');
          setMsg({ text: errText, isError: true });
        } catch (e) {
          setMsg({ text: e.message || 'GitHub login failed', isError: true });
        } finally {
          setBusy(false);
        }
      })();
    }
  }, []);

  // Google OAuth hash callback handling (when direct OAuth redirect flow is used)
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('id_token=')) {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const idToken = hashParams.get('id_token');
      if (idToken) {
        window.history.replaceState({}, '', window.location.pathname);
        handleGoogleResponse({ credential: idToken });
      }
    }
  }, []);

  if (guard.loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 relative overflow-hidden">
        <div className="fixed inset-0 z-[-2] bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
        <p className="text-gray-400 animate-pulse text-sm">Verifying login request…</p>
      </div>
    );
  }

  if (!guard.valid) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="fixed inset-0 z-[-2] bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
        <div className="relative liquid-glass-panel border border-white/20 rounded-3xl p-8 max-w-[520px] w-full text-center ring-1 ring-white/10" style={{ backdropFilter: 'blur(32px) saturate(190%)', WebkitBackdropFilter: 'blur(32px) saturate(190%)' }}>
          <div className="h-10 w-36 mx-auto mb-6">
            <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Authentication required</h1>
          <p className="text-gray-300 text-sm mb-2">{guard.error}</p>
          <p className="text-gray-400 text-xs mb-6">auth.xoeris.com can only be opened via a login request from an app (HIDE, Levelist, or xoeris.com). Direct navigation is blocked.</p>
          {onNavigate ? (
            <button onClick={() => onNavigate('xoeris')} className="inline-block bg-[#FDD935] text-black font-semibold rounded-xl px-6 py-3 text-sm hover:bg-[#FFE066] transition-all cursor-pointer border-none shadow-[0_0_20px_rgba(253,217,53,0.3)]">Go to Xoeris</button>
          ) : (
            <a href="https://xoeris.com" className="inline-block bg-[#FDD935] text-black font-semibold rounded-xl px-6 py-3 text-sm hover:bg-[#FFE066] transition-all border-none shadow-[0_0_20px_rgba(253,217,53,0.3)]">Go to Xoeris</a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FDD935] selection:text-black flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-[-2] bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      {/* Shared Animated Background Blobs */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen gpu-accel">
        <div className="blob blob-1 will-change-transform" style={{ backgroundColor: '#FDD935' }}></div>
        <div className="blob blob-2 will-change-transform" style={{ backgroundColor: '#FFC94A' }}></div>
        <div className="blob blob-3 will-change-transform" style={{ backgroundColor: '#FEF08A' }}></div>
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[60px]"></div>
      </div>

      <div className="w-full max-w-[460px] relative z-10">
        {/* Top Header: Logo + Back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate ? onNavigate('xoeris') : window.location.href = 'https://xoeris.com'}
            className="flex items-center group bg-transparent border-none p-0 cursor-pointer text-left"
          >
            <div className="h-9 w-36 transition-transform duration-300 group-hover:scale-105">
              <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="w-full h-full object-contain object-left" />
            </div>
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate('xoeris')}
              className="text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer"
            >
              ← Back to Xoeris
            </button>
          )}
        </div>

        {/* Liquid Glass Card */}
        <div
          className="relative liquid-glass-panel border border-white/20 rounded-3xl p-8 sm:p-9 text-left overflow-hidden ring-1 ring-white/10 shadow-2xl"
          style={{ backdropFilter: 'blur(32px) saturate(190%)', WebkitBackdropFilter: 'blur(32px) saturate(190%)' }}
        >
          {/* Top specular sheen */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></div>
          <div className="absolute -top-12 left-1/3 w-64 h-24 bg-[#FDD935]/[0.10] rounded-full blur-3xl pointer-events-none"></div>

          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {isSignUp ? 'Create account' : 'Log in'}
            </h1>
            <p className="text-xs text-gray-400">
              {isSignUp ? 'Sign up to access your Xoeris account and services' : (subheading || 'Access your Xoeris account and services')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={busy}
            className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl py-3.5 flex items-center justify-center gap-3 mb-3 font-semibold text-sm border border-white/15 transition-all duration-200 cursor-pointer disabled:opacity-60 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <GitHubIcon />
            {isSignUp ? 'Sign up with GitHub' : 'Continue with GitHub'}
          </button>

          <button
            type="button"
            onClick={handleGoogleLoginClick}
            disabled={busy}
            className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl py-3.5 flex items-center justify-center gap-3 mb-3 font-semibold text-sm border border-white/15 transition-all duration-200 cursor-pointer disabled:opacity-60 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <GoogleIcon />
            {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
          </button>

          {/* Hidden container for GIS button rendering / fallback */}
          <div id="google-signin-button" className="hidden"></div>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative bg-[#0b0b0b] px-3 text-[11px] font-medium uppercase tracking-wider text-gray-400 rounded-full border border-white/10">or continue with</span>
          </div>

          {!otpPending ? (
            <>
              <div className="space-y-3.5">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 tracking-wide">Username</label>
                    <input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-black/40 text-white rounded-xl px-4 py-3 text-sm outline-none border border-white/15 focus:border-[#FDD935] focus:ring-1 focus:ring-[#FDD935] placeholder:text-gray-500 transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 tracking-wide">Email</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 text-white rounded-xl px-4 py-3 text-sm outline-none border border-white/15 focus:border-[#FDD935] focus:ring-1 focus:ring-[#FDD935] placeholder:text-gray-500 transition-colors"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-gray-300 tracking-wide">Password</label>
                    {!isSignUp && (
                      <a href="https://xoeris.com/forgot-password" className="text-xs text-gray-400 hover:text-[#FDD935] transition-colors">Forgot password?</a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 text-white rounded-xl px-4 py-3 pr-11 text-sm outline-none border border-white/15 focus:border-[#FDD935] focus:ring-1 focus:ring-[#FDD935] placeholder:text-gray-500 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white bg-transparent border-none p-0 cursor-pointer text-sm">
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={isSignUp ? handleSignUpStep : handlePasswordLoginStep}
                disabled={busy}
                className="w-full bg-[#FDD935] text-black font-bold rounded-xl py-3.5 mt-5 hover:bg-[#FFE066] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 text-sm shadow-[0_0_25px_rgba(253,217,53,0.35)]"
              >
                {busy ? 'Please wait…' : (isSignUp ? 'Create account' : 'Log in')}
              </button>
            </>
          ) : (
            <div className="bg-black/50 border border-white/15 rounded-2xl p-5">
              <h3 className="text-white font-bold text-center mb-1 text-sm">Enter verification code</h3>
              <p className="text-gray-400 text-xs text-center mb-4">6-digit code sent to {pendingEmail}</p>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
                maxLength={6}
                className="w-full bg-black/60 text-[#FDD935] tracking-[0.5em] text-center text-xl font-mono rounded-xl p-3.5 mb-3 outline-none border border-white/20 focus:border-[#FDD935] transition-colors"
              />
              <div className="flex gap-2.5">
                <button onClick={handleVerifyOtp} disabled={busy} className="flex-1 bg-[#FDD935] text-black font-bold rounded-xl py-3 text-xs hover:bg-[#FFE066] transition-all cursor-pointer disabled:opacity-60">Verify &amp; Continue</button>
                <button onClick={() => { setOtpPending(false); setOtp(''); setMsg({ text: '', isError: false }); }} className="px-5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-white/10">Back</button>
              </div>
            </div>
          )}

          {msg.text && (
            <p className={`text-xs mt-4 text-center font-medium ${msg.isError ? 'text-red-400' : 'text-[#FDD935]'}`}>{msg.text}</p>
          )}

          <p className="text-gray-400 text-xs mt-6 text-center">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setMsg({ text: '', isError: false }); }}
                  className="text-white font-semibold underline hover:text-[#FDD935] transition-colors ml-1 bg-transparent border-none p-0 cursor-pointer"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setMsg({ text: '', isError: false }); }}
                  className="text-white font-semibold underline hover:text-[#FDD935] transition-colors ml-1 bg-transparent border-none p-0 cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          </p>

          <div className="border-t border-white/10 my-5" />

          <p className="text-gray-400 text-[11px] text-center leading-relaxed">
            By continuing, you agree to Xoeris's <a href="https://xoeris.com/terms" className="text-gray-300 underline hover:text-white transition-colors">Terms of Service</a> and{' '}
            <a href="https://xoeris.com/privacy" className="text-gray-300 underline hover:text-white transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
