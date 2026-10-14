import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, Bell, CheckCircle2, XCircle, AlertCircle, 
  RefreshCw, User, Mail, DollarSign, Calendar, Zap, Sparkles, 
  LogOut, Search, Filter, ArrowUpRight, Volume2, VolumeX, Eye,
  Key, Copy, Download, Smartphone, Monitor
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('xoeris_admin_token') || sessionStorage.getItem('xoeris_admin_token') || '';
    } catch {
      return '';
    }
  });

  // Login form state
  const [adminEmail, setAdminEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || '');
  const [adminPin, setAdminPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Prefetch configured ADMIN_EMAIL from backend if available
  useEffect(() => {
    const apiUrl = window.location.hostname.includes('xoeris.com')
      ? 'https://api.xoeris.com/api/database1/admin/login'
      : '/api/database1/admin/login';

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (data && data.email) {
          setAdminEmail(data.email);
        }
      })
      .catch(() => {});
  }, []);

  // Dashboard data state
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ pendingCount: 0, proCount: 0, ultraCount: 0, totalOrders: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Manual user tier assignment state
  const [manualEmail, setManualEmail] = useState('');
  const [manualPlan, setManualPlan] = useState('pro');
  const [manualDurationPreset, setManualDurationPreset] = useState('1m');
  const [manualCustomVal, setManualCustomVal] = useState(1);
  const [manualCustomUnit, setManualCustomUnit] = useState('months');
  const [isAssigning, setIsAssigning] = useState(false);

  // Universal Keygen state
  const [keygenEmail, setKeygenEmail] = useState('');
  const [keygenEdition, setKeygenEdition] = useState('pro');
  const [keygenPin, setKeygenPin] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [generatedKey, setGeneratedKey] = useState('');
  const [generatedFilename, setGeneratedFilename] = useState('Xoeris.key');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateKey = async (e) => {
    if (e) e.preventDefault();
    const email = (keygenEmail || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setActionMessage({ text: 'Please enter a valid user account email', type: 'error' });
      return;
    }

    let pin = (keygenPin || '').trim();
    if (!pin) {
      pin = Math.floor(100000 + Math.random() * 900000).toString();
      setKeygenPin(pin);
    }
    const finalPin = keygenEdition === 'ultra' && !pin.toUpperCase().includes('ULTRA')
      ? `ULTRA${pin}`
      : pin;

    const salt = 'APEX_SALT_2026_SECURE';
    const payload = `${email}${finalPin}${salt}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();

    const fullKey = `${finalPin}-${hashHex}`;
    setGeneratedKey(fullKey);
    setGeneratedFilename('Xoeris.key');
    setIsCopied(false);
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadKeyFile = () => {
    if (!generatedKey) return;
    const blob = new Blob([generatedKey], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Per-order approval duration options map
  const [orderDurations, setOrderDurations] = useState({});

  const prevPendingCountRef = useRef(0);

  // Audio notification chime
  const playChime = () => {
    if (!audioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}
  };

  const fetchDashboardData = async (silent = false) => {
    if (!token) return;
    if (!silent) setIsLoading(true);

    try {
      const apiUrl = window.location.hostname.includes('xoeris.com')
        ? 'https://api.xoeris.com/api/database1/admin/orders'
        : '/api/database1/admin/orders';

      const res = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setUsers(data.users || []);
        setStats(data.stats || { pendingCount: 0, proCount: 0, ultraCount: 0, totalOrders: 0 });

        // Trigger notification chime if new pending orders appeared
        const currentPending = (data.stats && data.stats.pendingCount) || 0;
        if (currentPending > prevPendingCountRef.current && prevPendingCountRef.current !== 0) {
          playChime();
        }
        prevPendingCountRef.current = currentPending;
      } else if (res && res.status === 401) {
        // Expired token
        handleSignOut();
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Poll for live incoming subscribe notifications every 6 seconds
  useEffect(() => {
    if (!token) return;
    fetchDashboardData(false);

    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 6000);

    return () => clearInterval(interval);
  }, [token]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (!adminEmail || !adminEmail.includes('@')) {
      setLoginError('Please enter a valid admin email address');
      return;
    }

    if (!adminPin || adminPin.trim().length === 0) {
      setLoginError('Please enter your PIN');
      return;
    }

    setIsLoggingIn(true);

    try {
      const apiUrl = window.location.hostname.includes('xoeris.com')
        ? 'https://api.xoeris.com/api/database1/admin/login'
        : '/api/database1/admin/login';

      let res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail.trim(), pin: adminPin.trim() })
      }).catch(() => null);

      if (!res) {
        if (apiUrl !== 'https://api.xoeris.com/api/database1/admin/login') {
          res = await fetch('https://api.xoeris.com/api/database1/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminEmail.trim(), pin: adminPin.trim() })
          }).catch(() => null);
        }
      }

      if (res && res.ok) {
        const data = await res.json();
        const adminJwt = data.token;
        if (data.admin?.email) {
          setAdminEmail(data.admin.email);
        }
        setToken(adminJwt);
        try {
          localStorage.setItem('xoeris_admin_token', adminJwt);
        } catch {}
      } else if (res) {
        const errJson = await res.json().catch(() => null);
        const serverMsg = errJson?.error || errJson?.message;
        if (serverMsg) {
          setLoginError(serverMsg);
        } else if (res.status === 401 || res.status === 403) {
          setLoginError('Invalid admin email or PIN.');
        } else {
          setLoginError(`Server error (${res.status}). Please check environment configuration.`);
        }
      } else {
        setLoginError('Unable to connect to authorization endpoint.');
      }
    } catch (err) {
      setLoginError(err.message || 'Unable to connect to authorization endpoint.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = () => {
    setToken('');
    try {
      localStorage.removeItem('xoeris_admin_token');
      sessionStorage.removeItem('xoeris_admin_token');
    } catch {}
  };

  const handleSetUserTier = async (orderId, targetEmail, planToSet, statusToSet = 'approved', durationOpts = {}) => {
    setActionMessage({ text: '', type: '' });

    try {
      const apiUrl = window.location.hostname.includes('xoeris.com')
        ? 'https://api.xoeris.com/api/database1/admin/approve-order'
        : '/api/database1/admin/approve-order';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          userEmail: targetEmail,
          plan: planToSet,
          status: statusToSet,
          duration: durationOpts.duration || '',
          durationValue: durationOpts.durationValue || 1,
          durationUnit: durationOpts.durationUnit || 'months'
        })
      });

      if (res && res.ok) {
        const data = await res.json();
        const durationText = planToSet === 'free' ? 'Reset to Free' : `set as ${planToSet.toUpperCase()}`;
        setActionMessage({
          text: `Success: ${targetEmail} ${durationText}`,
          type: 'success'
        });
        fetchDashboardData(true);
      } else {
        const err = await res.json().catch(() => ({}));
        setActionMessage({
          text: err.error || 'Failed to update subscription tier',
          type: 'error'
        });
      }
    } catch (err) {
      setActionMessage({ text: err.message, type: 'error' });
    }
  };

  const handleManualAssignment = async (e) => {
    if (e) e.preventDefault();
    if (!manualEmail || !manualEmail.includes('@')) {
      setActionMessage({ text: 'Enter a valid email address to grant tier', type: 'error' });
      return;
    }
    setIsAssigning(true);
    await handleSetUserTier(null, manualEmail.trim(), manualPlan, 'approved', {
      duration: manualDurationPreset,
      durationValue: manualCustomVal,
      durationUnit: manualCustomUnit
    });
    setIsAssigning(false);
    setManualEmail('');
  };

  // Filtered orders list
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' ? true : order.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (order.full_name && order.full_name.toLowerCase().includes(q)) ||
      (order.email && order.email.toLowerCase().includes(q)) ||
      (order.transaction_ref && order.transaction_ref.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // If not logged in as admin, render Security Gate
  if (!token) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between p-6 font-sans relative overflow-hidden selection:bg-[#FDD935] selection:text-black">
        <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FDD935]/10 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Header */}
        <header className="flex justify-between items-center max-w-5xl w-full mx-auto py-4 relative z-10">
          <button 
            onClick={() => onNavigate ? onNavigate('xoeris') : (window.location.href = '/')} 
            className="flex items-center group bg-transparent border-none p-0 cursor-pointer"
          >
            <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo Emblem" className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </button>
          <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
            <Lock size={12} />
            <span>Restricted Gateway</span>
          </div>
        </header>

        {/* Security Login Modal */}
        <main className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-md w-full mx-auto my-12">
          <div className="w-full p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FDD935]/50 to-transparent"></div>

            <div className="w-14 h-14 rounded-2xl bg-[#FDD935]/10 border border-[#FDD935]/30 flex items-center justify-center text-[#FDD935] mx-auto mb-8 shadow-[0_0_25px_rgba(253,217,53,0.2)]">
              <ShieldCheck size={28} />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <input 
                    type="email"
                    placeholder="Enter admin email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                    required
                    autoFocus
                  />
                  <Mail size={16} className="absolute right-3.5 top-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="relative">
                  <input 
                    type="password"
                    placeholder="Enter PIN"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                    required
                  />
                  <Lock size={16} className="absolute right-3.5 top-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 bg-[#FDD935] hover:bg-[#FFE066] text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-[0_0_25px_rgba(253,217,53,0.3)] border-none cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials…</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest py-4 relative z-10">
          © 2018-2026 Xoeris. All rights reserved.
        </footer>
      </div>
    );
  }

  // Authenticated Admin Dashboard View
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between font-sans relative overflow-x-hidden selection:bg-[#FDD935] selection:text-black">
      {/* Background grid */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(253,217,53,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-2xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate ? onNavigate('xoeris') : (window.location.href = '/')} 
              className="flex items-center group bg-transparent border-none p-0 cursor-pointer"
            >
              <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo Emblem" className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </button>
            <div className="h-5 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Admin Dashboard</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-[#FDD935] text-[10px] font-mono">
                {adminEmail || 'Admin'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live notification bell indicator */}
            <div className="relative">
              <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                stats.pendingCount > 0 
                  ? 'bg-[#FDD935]/15 border-[#FDD935] text-[#FDD935] shadow-[0_0_15px_rgba(253,217,53,0.3)] animate-pulse' 
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}>
                <Bell size={18} />
                {stats.pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-[#FDD935] text-black font-black text-[10px] rounded-full shadow-md">
                    {stats.pendingCount}
                  </span>
                )}
              </div>
            </div>

            {/* Audio Toggle */}
            <button 
              onClick={() => setAudioEnabled(prev => !prev)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={audioEnabled ? 'Notification Audio Enabled' : 'Notification Audio Muted'}
            >
              {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Refresh */}
            <button 
              onClick={() => fetchDashboardData(false)}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin text-[#FDD935]' : ''} />
            </button>

            {/* Sign Out */}
            <button 
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10 space-y-8">
        {/* Banner Alert for Pending Subscriptions */}
        {stats.pendingCount > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FDD935]/20 via-[#FDD935]/10 to-transparent border border-[#FDD935]/40 flex items-center justify-between shadow-[0_0_30px_rgba(253,217,53,0.15)] animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDD935] text-black flex items-center justify-center font-black">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {stats.pendingCount} New Subscription Request{stats.pendingCount > 1 ? 's' : ''} Received
                </p>
                <p className="text-xs text-gray-300">
                  Customers have confirmed payment authorization and are awaiting manual approval for Pro or Ultra.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setFilterStatus('pending')}
              className="px-4 py-2 bg-[#FDD935] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#FFE066] transition-colors border-none cursor-pointer"
            >
              Review Pending
            </button>
          </div>
        )}

        {/* Global Action Message Toast */}
        {actionMessage.text && (
          <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
            actionMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage({ text: '', type: '' })} className="bg-transparent border-none text-gray-400 hover:text-white cursor-pointer">×</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] font-mono uppercase text-gray-400 mb-1 flex items-center justify-between">
              <span>Pending Orders</span>
              <Bell size={14} className={stats.pendingCount > 0 ? 'text-[#FDD935]' : 'text-gray-500'} />
            </div>
            <div className={`text-3xl font-black ${stats.pendingCount > 0 ? 'text-[#FDD935]' : 'text-white'}`}>
              {stats.pendingCount}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Requires admin review</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] font-mono uppercase text-gray-400 mb-1 flex items-center justify-between">
              <span>Active Pro Users</span>
              <Zap size={14} className="text-[#FDD935]" />
            </div>
            <div className="text-3xl font-black text-white">
              {stats.proCount}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Tier Pro in database</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] font-mono uppercase text-gray-400 mb-1 flex items-center justify-between">
              <span>Active Ultra Users</span>
              <Sparkles size={14} className="text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-300">
              {stats.ultraCount}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Tier Ultra in database</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] font-mono uppercase text-gray-400 mb-1 flex items-center justify-between">
              <span>Total Requests</span>
              <DollarSign size={14} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {stats.totalOrders}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Historical transmissions</div>
          </div>
        </div>

        {/* Manual Tier Grant Tool */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FDD935] flex items-center gap-2">
              <User size={16} />
              <span>Manual User Tier Assignment</span>
            </h3>
            <span className="text-[11px] text-gray-400 font-mono">
              Auto reset to Free supported (week / months / year)
            </span>
          </div>

          <form onSubmit={handleManualAssignment} className="flex flex-col lg:flex-row gap-3">
            <input 
              type="email"
              placeholder="Target user email (e.g. user@example.com)"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935]"
            />
            <select
              value={manualPlan}
              onChange={(e) => setManualPlan(e.target.value)}
              className="px-4 py-3 bg-black border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#FDD935]"
            >
              <option value="pro">Set as Pro</option>
              <option value="ultra">Set as Ultra</option>
              <option value="free">Reset to Free</option>
            </select>

            {manualPlan !== 'free' && (
              <select
                value={manualDurationPreset}
                onChange={(e) => setManualDurationPreset(e.target.value)}
                className="px-3 py-3 bg-black border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#FDD935]"
              >
                <option value="1w">Auto-reset in 1 Week</option>
                <option value="2w">Auto-reset in 2 Weeks</option>
                <option value="1m">Auto-reset in 1 Month</option>
                <option value="3m">Auto-reset in 3 Months</option>
                <option value="6m">Auto-reset in 6 Months</option>
                <option value="1y">Auto-reset in 1 Year</option>
                <option value="custom">Custom Duration...</option>
                <option value="never">Permanent (No reset)</option>
              </select>
            )}

            {manualPlan !== 'free' && manualDurationPreset === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={manualCustomVal}
                  onChange={(e) => setManualCustomVal(e.target.value)}
                  className="w-16 px-3 py-3 bg-black border border-white/15 rounded-xl text-white text-xs font-mono text-center focus:outline-none focus:border-[#FDD935]"
                />
                <select
                  value={manualCustomUnit}
                  onChange={(e) => setManualCustomUnit(e.target.value)}
                  className="px-3 py-3 bg-black border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#FDD935]"
                >
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isAssigning}
              className="px-6 py-3 bg-[#FDD935] hover:bg-[#FFE066] text-black font-black uppercase text-xs rounded-xl border-none cursor-pointer tracking-wider shrink-0 transition-colors"
            >
              {isAssigning ? 'Saving…' : 'Apply Tier'}
            </button>
          </form>
        </div>

        {/* XOERIS UNIVERSAL KEYGEN SUITE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#FDD935] flex items-center gap-2">
                <Key size={18} />
                <span>Xoeris Universal Keygen</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Generate offline activation keys for all Xoeris apps and platforms (Android &amp; Windows PC)
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-[#FDD935] text-[10px] font-mono self-start sm:self-auto">
              Offline Cryptographic Keygen
            </span>
          </div>

          <form onSubmit={handleGenerateKey} className="space-y-5">
            {/* User Account Email Input */}
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                1. User Account Email
              </label>
              <input
                type="email"
                placeholder="Enter user account email (e.g. user@xoeris.com)"
                value={keygenEmail}
                onChange={(e) => setKeygenEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935]"
                required
              />
            </div>

            {/* Edition & PIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                  2. License Edition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setKeygenEdition('pro')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      keygenEdition === 'pro'
                        ? 'bg-[#FDD935] text-black border-[#FDD935]'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    PRO EDITION
                  </button>
                  <button
                    type="button"
                    onClick={() => setKeygenEdition('ultra')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      keygenEdition === 'ultra'
                        ? 'bg-purple-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    ULTRA EDITION
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    4. Activation PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setKeygenPin(Math.floor(100000 + Math.random() * 900000).toString())}
                    className="text-[11px] text-[#FDD935] hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Generate Random PIN
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 123456"
                  value={keygenPin}
                  onChange={(e) => setKeygenPin(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935]"
                />
              </div>
            </div>

            {/* Generate Key Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#FDD935] hover:bg-[#FFE066] text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(253,217,53,0.25)] border-none cursor-pointer flex items-center justify-center gap-2"
            >
              <Key size={16} />
              <span>Generate Offline Activation Key</span>
            </button>
          </form>

          {/* Key Output Card */}
          {generatedKey && (
            <div className="mt-6 p-5 rounded-2xl bg-white/[0.04] border border-[#FDD935]/40 shadow-[0_0_25px_rgba(253,217,53,0.15)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#FDD935]">
                  Target File: {generatedFilename} ({keygenApp} {keygenEdition.toUpperCase()})
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ready to Activate
                </span>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-xs text-white break-all select-all">
                {generatedKey}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors border border-white/10 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Key'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadKeyFile}
                  className="flex-1 py-2.5 px-4 bg-[#FDD935] hover:bg-[#FFE066] text-black rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors border-none cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download .{generatedFilename.split('.').pop()} File</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Orders Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Incoming Subscription Requests</h2>
              <p className="text-xs text-gray-400">Manage user payments and grant Pro or Ultra status</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border-none cursor-pointer ${
                  filterStatus === 'all' ? 'bg-[#FDD935] text-black font-bold' : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border-none cursor-pointer ${
                  filterStatus === 'pending' ? 'bg-[#FDD935] text-black font-bold' : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                Pending ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border-none cursor-pointer ${
                  filterStatus === 'approved' ? 'bg-[#FDD935] text-black font-bold' : 'text-gray-400 hover:text-white bg-transparent'
                }`}
              >
                Approved ({orders.filter(o => o.status === 'approved').length})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input 
              type="text"
              placeholder="Search by customer name, email, or reference ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#FDD935]"
            />
            <Search size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 border border-white/5 rounded-2xl bg-black/40">
              <p className="text-gray-400 text-sm">No subscription requests found matching this filter.</p>
              <p className="text-gray-600 text-xs mt-1">When users submit the Subscribe form, they appear here live.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 pl-2">Customer</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Plan Requested</th>
                    <th className="pb-3">Cycle & Amount</th>
                    <th className="pb-3">Authorization</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => {
                    const isPending = order.status === 'pending';
                    const isApproved = order.status === 'approved';
                    const isUltra = (order.plan || '').toLowerCase() === 'ultra';

                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pl-2 font-bold text-white">
                          <div>{order.full_name}</div>
                          <div className="text-[10px] text-gray-500 font-normal">{order.transaction_ref}</div>
                        </td>
                        <td className="py-4 text-gray-300">
                          {order.email}
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            isUltra 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                              : 'bg-[#FDD935]/20 text-[#FDD935] border border-[#FDD935]/30'
                          }`}>
                            {order.plan}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300">
                          <span className="font-bold text-white">${order.amount_dollars || (isUltra ? 1440 : 420)}</span>
                          <span className="text-gray-500 text-[10px] ml-1">({order.billing_cycle})</span>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                            <CheckCircle2 size={11} />
                            <span>"{order.agree_text}"</span>
                          </span>
                        </td>
                        <td className="py-4">
                          {isPending && (
                            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold uppercase">
                              Pending
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                              Active {order.plan}
                            </span>
                          )}
                          {order.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right pr-2">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            <select
                              value={orderDurations[order.id] || '1y'}
                              onChange={(e) => setOrderDurations({ ...orderDurations, [order.id]: e.target.value })}
                              className="px-2 py-1 bg-black/80 border border-white/20 rounded-md text-[10px] font-mono text-gray-300 focus:outline-none focus:border-[#FDD935]"
                              title="Auto-reset duration"
                            >
                              <option value="1w">1 Week reset</option>
                              <option value="2w">2 Weeks reset</option>
                              <option value="1m">1 Month reset</option>
                              <option value="3m">3 Months reset</option>
                              <option value="6m">6 Months reset</option>
                              <option value="1y">1 Year reset</option>
                              <option value="never">Permanent</option>
                            </select>

                            <button
                              onClick={() => handleSetUserTier(order.id, order.email, 'pro', 'approved', { duration: orderDurations[order.id] || '1y' })}
                              className="px-2.5 py-1 bg-[#FDD935] hover:bg-[#FFE066] text-black font-black rounded-lg text-[10px] uppercase transition-colors border-none cursor-pointer"
                              title="Set user tier to Pro with auto reset"
                            >
                              Set as Pro
                            </button>
                            <button
                              onClick={() => handleSetUserTier(order.id, order.email, 'ultra', 'approved', { duration: orderDurations[order.id] || '1y' })}
                              className="px-2.5 py-1 bg-purple-500 hover:bg-purple-400 text-white font-black rounded-lg text-[10px] uppercase transition-colors border-none cursor-pointer"
                              title="Set user tier to Ultra with auto reset"
                            >
                              Set as Ultra
                            </button>
                            {isPending && (
                              <button
                                onClick={() => handleSetUserTier(order.id, order.email, 'free', 'rejected')}
                                className="px-2 py-1 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg text-[10px] transition-colors border border-white/10 cursor-pointer"
                                title="Reject order"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest py-6 border-t border-white/5 relative z-10">
        © 2018-2026 Xoeris. All rights reserved.
      </footer>
    </div>
  );
}
