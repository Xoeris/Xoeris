import React, { useEffect, useState } from 'react';

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 10.06.5.09.68-.22.68-.48v-1.7c-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.38 9.38 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.56 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9v2.82c0 .26.18.58.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M21.8 12.2c0-.67-.06-1.32-.17-1.95H12v3.7h5.5a4.76 4.76 0 0 1-2.07 3.12v2.59h3.35c1.96-1.81 3.02-4.48 3.02-7.46Z"/>
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.44l-3.35-2.59c-.93.62-2.12.99-3.27.99-2.52 0-4.65-1.7-5.41-3.99H2.13v2.65A9.98 9.98 0 0 0 12 22Z"/>
      <path fill="#FBBC05" d="M6.59 13.97A5.99 5.99 0 0 1 6.28 12c0-.69.12-1.36.31-1.97V7.38H2.13A10 10 0 0 0 1 12c0 1.62.39 3.15 1.13 4.62l3.46-2.65Z"/>
      <path fill="#EA4335" d="M12 6.5c1.47 0 2.79.51 3.83 1.5l2.87-2.87C17.03 3.6 14.76 2.6 12 2.6 7.7 2.6 4.06 5.15 2.13 9.02l3.46 2.68C6.35 8.25 8.88 6.5 12 6.5Z"/>
    </svg>
  );
}

export default function AuthPage() {
  // Guard: require valid state param (login request)
  const [guard, setGuard] = useState({ loading: true, valid: false, error: '', client: '', redirectUri: '' });
  const [mode, setMode] = useState('login'); // login | otp
  const [email, setEmail] = useState('');
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
  const redirectParam = params.get('redirect_uri');

  useEffect(() => {
    if (!state) {
      setGuard({ loading: false, valid: false, error: 'Missing login request. Open via app.', client: '', redirectUri: '' });
      return;
    }
    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify?state=${encodeURIComponent(state)}`);
        const data = await res.json();
        if (data.valid) {
          setGuard({ loading: false, valid: true, error: '', client: data.client || clientParam || '', redirectUri: data.redirect_uri || redirectParam || '' });
        } else {
          setGuard({ loading: false, valid: false, error: data.error || 'Invalid or expired login request', client: '', redirectUri: '' });
        }
      } catch (e) {
        setGuard({ loading: false, valid: false, error: e.message, client: '', redirectUri: '' });
      }
    };
    verify();
    // GIS init for Google
    const tryInit = () => {
      if (window.google?.accounts?.id && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            ux_mode: 'popup',
          });
        } catch {}
      }
    };
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      tryInit();
    } else {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = tryInit;
      document.head.appendChild(s);
    }
  }, []);

  const consumeAndRedirect = async (token, user) => {
    try { await fetch('/api/auth/consume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state }) }); } catch {}
    const target = guard.redirectUri || redirectParam;
    if (target) {
      const sep = target.includes('?') ? '&' : '?';
      const payload = encodeURIComponent(token || '');
      window.location.href = `${target}${sep}token=${payload}&state=${encodeURIComponent(state)}`;
    } else if (guard.client === 'hide' || clientParam === 'hide') {
      // For HIDE desktop, show token and instruct to return to app (deep link)
      window.location.href = `hide://auth?token=${encodeURIComponent(token || '')}&state=${encodeURIComponent(state)}`;
      setTimeout(() => { window.location.href = 'https://xoeris.com?auth=success'; }, 1500);
    } else {
      window.location.href = 'https://xoeris.com?auth=success';
    }
  };

  async function handleGoogleResponse(response) {
    try {
      setBusy(true);
      setMsg({ text: '', isError: false });
      const res = await fetch('https://api.xoeris.com/api/database1/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        await consumeAndRedirect(data.token, data.user);
      } else {
        setMsg({ text: data.error || 'Google authentication failed', isError: true });
      }
    } catch (e) {
      setMsg({ text: e.message, isError: true });
    } finally { setBusy(false); }
  }

  function handleGoogleLogin() {
    if (window.google?.accounts?.id?.prompt) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed && notification.isNotDisplayed()) {
          // fallback to One Tap popup
          const client = window.google.accounts.oauth2?.initTokenClient;
          if (client) {
            // use token client as fallback
          }
        }
      });
    }
    // Also trigger One Tap
    try { window.google.accounts.id.prompt(); } catch {}
  }

  function handleGitHubLogin() {
    const cid = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!cid) {
      setMsg({ text: 'GitHub OAuth not configured (VITE_GITHUB_CLIENT_ID)', isError: true });
      return;
    }
    const params = new URLSearchParams({
      client_id: cid,
      redirect_uri: 'https://auth.xoeris.com/github/callback',
      scope: 'read:user user:email',
      state: state || '',
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
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
    if (window.location.pathname === '/github/callback' && p.get('code')) {
      const code = p.get('code');
      const st = p.get('state') || state;
      (async () => {
        setBusy(true);
        try {
          const res = await fetch('https://api.xoeris.com/api/database1/github-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          const data = await res.json();
          if (res.ok) {
            // consume state if present
            if (st) { try { await fetch('/api/auth/consume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: st }) }); } catch {} }
            const token = data.token;
            const target = guard.redirectUri || redirectParam;
            if (target) window.location.href = `${target}${target.includes('?')?'&':'?'}token=${encodeURIComponent(token)}&state=${encodeURIComponent(st||'')}`;
            else window.location.href = 'https://xoeris.com?auth=success';
          } else {
            setMsg({ text: data.error || 'GitHub login failed', isError: true });
          }
        } catch (e) { setMsg({ text: e.message, isError: true }); }
        finally { setBusy(false); }
      })();
    }
  }, [guard]);

  if (guard.loading) {
    return (
      <div className="min-h-screen bg-hide-canvas flex items-center justify-center px-4">
        <p className="text-hide-text-muted animate-pulse text-sm">Verifying login request…</p>
      </div>
    );
  }

  if (!guard.valid) {
    return (
      <div className="min-h-screen bg-hide-canvas flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[600px] text-center">
          <h1 className="text-2xl font-bold text-hide-text-primary mb-3">Authentication required</h1>
          <p className="text-hide-text-secondary text-sm mb-2">{guard.error}</p>
          <p className="text-hide-text-muted text-xs mb-6">auth.xoeris.com can only be opened via a login request from an app (HIDE, Levelist, or xoeris.com). Direct navigation is blocked.</p>
          <a href="https://xoeris.com" className="inline-block bg-hide-action text-hide-action-text rounded-hide-lg px-6 py-3 text-sm font-semibold hover:bg-hide-action-hover transition-colors duration-hide-fast">Go to Xoeris</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hide-canvas flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[600px]">
        <div className="mb-10">
          <span className="text-hide-text-primary font-black tracking-tight text-xl">Xoeris</span>
          <span className="text-hide-text-muted text-xl"> / </span>
          <span className="text-hide-text-secondary text-xl">Acelbyte</span>
        </div>
        <h1 className="text-4xl font-bold text-hide-text-primary text-center mb-8">Log in</h1>

        <button
          onClick={handleGitHubLogin}
          disabled={busy}
          className="w-full bg-hide-elevated text-hide-text-primary rounded-hide-lg py-4 flex items-center justify-center gap-3 mb-3 font-medium border border-hide-border-subtle hover:bg-hide-hover hover:border-hide-border-default transition-all duration-hide-fast disabled:opacity-60"
        >
          <GitHubIcon />
          Continue with GitHub
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={busy}
          className="w-full bg-hide-elevated text-hide-text-primary rounded-hide-lg py-4 flex items-center justify-center gap-3 mb-3 font-medium border border-hide-border-subtle hover:bg-hide-hover hover:border-hide-border-default transition-all duration-hide-fast disabled:opacity-60"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="border-t border-hide-border-default my-6" />

        {!otpPending ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-hide-input text-hide-text-primary rounded-hide-md p-4 mb-3 outline-none border border-hide-border-input focus:border-hide-action placeholder:text-hide-text-muted transition-colors duration-hide-fast"
            />
            <div className="relative mb-3">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-hide-input text-hide-text-primary rounded-hide-md p-4 pr-12 outline-none border border-hide-border-input focus:border-hide-action placeholder:text-hide-text-muted transition-colors duration-hide-fast"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-hide-text-muted hover:text-hide-text-secondary">
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            <a href="https://xoeris.com/forgot-password" className="text-hide-text-secondary text-sm hover:text-hide-text-primary transition-colors duration-hide-fast">Forget password?</a>

            <button
              onClick={handlePasswordLoginStep}
              disabled={busy}
              className="w-full bg-hide-action text-hide-action-text font-semibold rounded-hide-lg py-4 mt-4 hover:bg-hide-action-hover transition-all duration-hide-fast disabled:opacity-60"
            >
              {busy ? 'Please wait…' : 'Log in'}
            </button>
          </>
        ) : (
          <div className="bg-hide-primary border border-hide-border-subtle rounded-hide-xl p-5">
            <h3 className="text-hide-text-primary font-semibold text-center mb-2">Enter OTP</h3>
            <p className="text-hide-text-secondary text-xs text-center mb-4">6-digit code sent to {pendingEmail} (10 min expiry)</p>
            <input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
              maxLength={6}
              className="w-full bg-hide-canvas text-hide-text-primary tracking-[0.5em] text-center text-xl rounded-hide-md p-4 mb-3 outline-none border border-hide-border-input focus:border-hide-action transition-colors duration-hide-fast"
            />
            <div className="flex gap-3">
              <button onClick={handleVerifyOtp} disabled={busy} className="flex-1 bg-hide-action text-hide-action-text font-semibold rounded-hide-lg py-3 hover:bg-hide-action-hover transition-all duration-hide-fast disabled:opacity-60">Verify &amp; Continue</button>
              <button onClick={() => { setOtpPending(false); setOtp(''); setMsg({ text: '', isError: false }); }} className="px-6 bg-hide-ghost text-hide-text-primary rounded-hide-lg hover:bg-hide-hover transition-colors duration-hide-fast">Back</button>
            </div>
          </div>
        )}

        {msg.text && (
          <p className={`text-sm mt-4 text-center ${msg.isError ? 'text-hide-error' : 'text-hide-success'}`}>{msg.text}</p>
        )}

        <p className="text-hide-text-secondary text-sm mt-6 text-center">
          Don't have an account? <a href={`https://auth.xoeris.com?state=${encodeURIComponent(state)}&mode=signup`} className="text-hide-text-primary underline hover:text-hide-text-emphasis transition-colors duration-hide-fast">Sign up</a>
        </p>

        <div className="border-t border-hide-border-default my-6" />

        <p className="text-hide-text-muted text-xs text-center leading-relaxed">
          By continuing, you are agreeing to Xoeris's <a href="https://xoeris.com/terms" className="underline hover:text-hide-text-secondary transition-colors duration-hide-fast">Terms of Service</a> and{' '}
          <a href="https://xoeris.com/privacy" className="underline hover:text-hide-text-secondary transition-colors duration-hide-fast">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
