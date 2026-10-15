import React, { useState, useRef, useEffect } from 'react';
import {
  Send, ArrowLeft, RefreshCw, Plus, ChevronDown, User,
  Search, Folder, Layout, SlidersHorizontal, Mic,
  AudioWaveform, ArrowUp, PanelLeft, Sparkles, MessageSquare,
  LogOut, ExternalLink, X, Trash2, Copy, Check, Terminal, Cpu, Code,
  ArrowRight, ShieldCheck, Lock, Loader2, Menu, Settings, Info
} from 'lucide-react';

import AuthPage from './AuthPage';
import { 
  getStoredUser, 
  getStoredToken, 
  setSession, 
  clearSession, 
  syncUserFromDatabase,
  isUserAdmin,
  isUserUltra 
} from './services/authService';

const PUBLIC_API_KEY = import.meta.env.VITE_XOERIS_PUBLIC_KEY || '';

// Xoeris Spark Emblem Icon
function XalmeSpark({ className = "w-6 h-6 text-[#FDD935]" }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute inset-0 bg-[#FDD935]/20 rounded-full blur-sm" />
      <svg className={`${className} relative z-10`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z" />
      </svg>
    </div>
  );
}

export default function ChatPage({ onNavigate }) {
  // Check for Xoeris auth token or chat auth across subdomains
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getStoredToken();
    const hasChatAuth = localStorage.getItem('xoeris_chat_auth') === 'true';
    return Boolean(token) || hasChatAuth;
  });

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [syncing, setSyncing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Atlas 5');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Chat conversation state
  const [currentThreadId, setCurrentThreadId] = useState(() => {
    return localStorage.getItem('xalme_active_thread_id') || `thread_${Date.now()}`;
  });

  // Persistent threads from localStorage (no fake dummy items)
  const [threads, setThreads] = useState(() => {
    try {
      const stored = localStorage.getItem('xalme_chat_threads');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load active thread messages on mount or thread switch
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(`xalme_msgs_${currentThreadId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
  }, [currentThreadId]);

  // Auth sync and incoming query param handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setSession(urlToken, null);
      setIsAuthenticated(true);
      setSyncing(true);
      syncUserFromDatabase()
        .then((user) => {
          if (user) setCurrentUser(user);
        })
        .catch(() => null)
        .finally(() => setSyncing(false));
      params.delete('token');
      params.delete('auth');
      params.delete('state');
      const cleanSearch = params.toString();
      const cleanUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '');
      window.history.replaceState({}, '', cleanUrl);
    } else {
      const token = getStoredToken();
      const authenticated = Boolean(token) || localStorage.getItem('xoeris_chat_auth') === 'true';
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setSyncing(true);
        syncUserFromDatabase()
          .then((user) => {
            if (user) {
              setIsAuthenticated(true);
              setCurrentUser(user);
            }
          })
          .catch(() => null)
          .finally(() => setSyncing(false));
      } else {
        setSyncing(false);
      }
    }
    setCurrentUser(getStoredUser());

    const handleAuthChange = () => {
      const token = getStoredToken();
      setIsAuthenticated(Boolean(token));
      setCurrentUser(getStoredUser());
    };
    window.addEventListener('xoeris_auth_change', handleAuthChange);
    return () => window.removeEventListener('xoeris_auth_change', handleAuthChange);
  }, []);

  useEffect(() => {
    if (isAuthenticated && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAuthenticated]);

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = currentUser?.name || currentUser?.username || 'Architect';

  // Create a new thread
  const handleStartNewChat = () => {
    const newId = `thread_${Date.now()}`;
    setCurrentThreadId(newId);
    setMessages([]);
    setInput('');
    localStorage.setItem('xalme_active_thread_id', newId);
  };

  // Switch to an existing thread
  const handleSelectThread = (threadId) => {
    setCurrentThreadId(threadId);
    localStorage.setItem('xalme_active_thread_id', threadId);
  };

  // Delete a thread
  const handleDeleteThread = (e, threadId) => {
    e.stopPropagation();
    const updated = threads.filter((t) => t.id !== threadId);
    setThreads(updated);
    localStorage.setItem('xalme_chat_threads', JSON.stringify(updated));
    localStorage.removeItem(`xalme_msgs_${threadId}`);
    if (currentThreadId === threadId) {
      handleStartNewChat();
    }
  };

  const handleSend = async (userPromptText) => {
    const textToSend = typeof userPromptText === 'string' ? userPromptText : input.trim();
    if (!textToSend || loading) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const updatedMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(updatedMessages);
    setLoading(true);
    setStatusText('Xalme is synthesizing response...');

    // Save/update thread list in localStorage
    const existingThread = threads.find((t) => t.id === currentThreadId);
    if (!existingThread) {
      const newThread = {
        id: currentThreadId,
        title: textToSend.slice(0, 36) + (textToSend.length > 36 ? '…' : ''),
        createdAt: new Date().toISOString()
      };
      const updatedThreads = [newThread, ...threads];
      setThreads(updatedThreads);
      localStorage.setItem('xalme_chat_threads', JSON.stringify(updatedThreads));
    }
    localStorage.setItem(`xalme_msgs_${currentThreadId}`, JSON.stringify(updatedMessages));

    try {
      const response = await fetch('https://api.xoeris.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(PUBLIC_API_KEY ? { 'Authorization': `Bearer ${PUBLIC_API_KEY}` } : {})
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are Xalme, an advanced AI reasoning system developed by Xoeris. You provide elegant, robust, and precise architectural and software engineering guidance.' },
            ...updatedMessages.filter(m => m.role !== 'system')
          ],
          max_new_tokens: 768,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content || 'No response payload received.';
      const finalMessages = [...updatedMessages, { role: 'assistant', content: assistantMessage }];
      setMessages(finalMessages);
      localStorage.setItem(`xalme_msgs_${currentThreadId}`, JSON.stringify(finalMessages));
      setStatusText('');
    } catch (err) {
      const errorMessages = [...updatedMessages, { role: 'assistant', content: `[XALME SYSTEM ALERT] ${err.message}` }];
      setMessages(errorMessages);
      localStorage.setItem(`xalme_msgs_${currentThreadId}`, JSON.stringify(errorMessages));
      setStatusText('Execution completed with warnings.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 220)}px`;
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Auth Screen Render using unified AuthPage design
  if (!isAuthenticated) {
    return (
      <AuthPage
        onNavigate={onNavigate}
        onSuccess={() => setIsAuthenticated(true)}
        subheading="Access your Xoeris account for Xalme Chat"
      />
    );
  }

  const isAdmin = isUserAdmin(currentUser);
  const isUltra = isUserUltra(currentUser);
  const hasAccess = isAdmin || isUltra;

  // Loading state while syncing database permissions
  if (syncing && !hasAccess) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-sans p-6 relative overflow-hidden">
        <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(253,217,53,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <Loader2 className="w-9 h-9 text-[#FDD935] animate-spin" />
          <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">Verifying Xoeris subscription...</p>
        </div>
      </div>
    );
  }

  // Gate for Free and Pro users: Web version is exclusively available to Ultra users (Admin has all privileges)
  if (!hasAccess) {
    const currentTierLabel = (currentUser?.subscription_tier || 'free').toUpperCase();
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-sans p-6 relative overflow-hidden selection:bg-[#FDD935] selection:text-black">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(253,217,53,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>

        {/* Ambient Glow Blobs */}
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-20">
          <div className="absolute top-1/4 left-1/3 w-[50vw] h-[50vw] bg-[#FDD935]/15 rounded-full blur-[140px]" />
        </div>

        {/* Ultra Paywall Container */}
        <div className="relative z-10 max-w-lg w-full bg-[#0b0b0b]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center animate-fade-in">
          {/* Top Lock Badge */}
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#FDD935]/10 border border-[#FDD935]/30 flex items-center justify-center text-[#FDD935] shadow-[0_0_25px_rgba(253,217,53,0.25)]">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/30 text-[#FDD935] text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles size={11} />
            <span>Ultra Tier Exclusive</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            Xalme Chat Web Requires Ultra
          </h1>

          <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-6">
            The browser version of Xalme Chat is exclusively available to Xoeris Ultra members. Free and Pro users can chat with Xalme via our desktop and mobile apps, or upgrade now for direct web access.
          </p>

          {/* User Account Badge */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-6 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FDD935] text-black font-black text-xs flex items-center justify-center shrink-0">
                {(currentUser?.username || currentUser?.email || 'U')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser?.username || currentUser?.name || 'Xoeris Member'}</p>
                <p className="text-[10px] text-gray-500 truncate">{currentUser?.email || 'No email attached'}</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10 uppercase">
                {currentTierLabel} PLAN
              </span>
            </div>
          </div>

          {/* What Ultra Includes */}
          <div className="space-y-2 mb-6 text-left text-xs text-gray-300 bg-black/40 p-4 rounded-xl border border-white/5 font-mono">
            <div className="flex items-center gap-2">
              <Check size={13} className="text-[#FDD935] shrink-0" />
              <span>Full Web, Desktop, & Android Xalme Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={13} className="text-[#FDD935] shrink-0" />
              <span>All Atlas 5, Forge 6 & Nebula 7 Models</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={13} className="text-[#FDD935] shrink-0" />
              <span>Dedicated High-Speed GPU Inference</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="w-full py-3.5 px-6 rounded-xl bg-[#FDD935] hover:bg-[#FFE066] text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-[0_0_20px_rgba(253,217,53,0.35)] hover:shadow-[0_0_25px_rgba(253,217,53,0.55)] active:scale-[0.98]"
            >
              <span>Upgrade to Ultra</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onNavigate ? onNavigate('home') : window.location.href = '/'}
                className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Return to Home
              </button>
              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen supports-[height:100dvh]:h-dvh bg-[#0A0A0F] text-white flex font-sans selection:bg-[#FFC94A] selection:text-black overflow-hidden relative">
      {/* Ambient background glow blobs */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-25">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FFC94A]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-[#3B82F6]/10 rounded-full blur-[140px]" />
      </div>

      {/* Xalme Sidebar matching desktop */}
      <aside
        className={`fixed md:relative top-0 bottom-0 left-0 ${
          sidebarOpen ? 'w-60' : 'w-0 -translate-x-full md:w-0'
        } bg-[#0A0A0F] flex flex-col justify-between transition-all duration-300 overflow-hidden z-40 shrink-0 h-full`}
      >
        <div className="flex flex-col flex-1 min-h-0 p-3 overflow-hidden">
          {/* Top Hamburger Toggle */}
          <div className="mb-4 pt-1 px-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center"
              title="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
          </div>

          {/* Section: WORKSPACE */}
          <div className="px-2 mb-2 text-[10px] font-bold tracking-widest text-[#4A4A5A] uppercase">
            WORKSPACE
          </div>

          {/* Chat active nav item */}
          <div className="space-y-1.5">
            <button
              onClick={() => {
                // If on another view or view is cleared, return to chat
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1C180E] border border-[#FFC94A] text-[#FFC94A] font-semibold text-xs flex items-center gap-3 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,201,74,0.1)] text-left"
            >
              <MessageSquare size={15} className="text-[#FFC94A] shrink-0" />
              <span>Chat</span>
            </button>

            {/* + New Session */}
            <button
              onClick={handleStartNewChat}
              className="w-full px-3 py-2.5 rounded-xl bg-transparent hover:bg-white/[0.04] text-[#888898] hover:text-white text-xs flex items-center gap-3 transition-colors cursor-pointer border-none text-left"
            >
              <Plus size={15} className="text-[#888898] shrink-0" />
              <span>New Session</span>
            </button>
          </div>

          {/* Saved Sessions list */}
          {threads.length > 0 && (
            <div className="mt-5 flex-1 min-h-0 overflow-y-auto space-y-1 pr-1">
              <div className="px-2 mb-2 text-[9px] font-bold tracking-widest text-[#4A4A5A] uppercase">
                RECENT
              </div>
              {threads.map((thread) => {
                const isActive = thread.id === currentThreadId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`group w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-white/[0.06] text-white font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="truncate pr-2">{thread.title}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteThread(e, thread.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-0.5 rounded transition-opacity bg-transparent border-none cursor-pointer"
                      title="Delete session"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pinned Bottom: Settings & About */}
        <div className="p-3 border-t border-[#1C1C24] space-y-1">
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full px-3 py-2.5 rounded-xl bg-transparent hover:bg-white/[0.04] text-[#888898] hover:text-white text-xs flex items-center gap-3 transition-colors cursor-pointer border-none text-left"
          >
            <Settings size={15} className="text-[#888898] shrink-0" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setAboutOpen(true)}
            className="w-full px-3 py-2.5 rounded-xl bg-transparent hover:bg-white/[0.04] text-[#888898] hover:text-white text-xs flex items-center gap-3 transition-colors cursor-pointer border-none text-left"
          >
            <Info size={15} className="text-[#888898] shrink-0" />
            <span>About</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Chat Workspace framed with golden border */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full w-full relative z-10 bg-[#0A0A0F] border-l border-[#FFC94A]/40">
        
        {/* Workspace Top Header Bar */}
        <header className="h-16 shrink-0 px-6 flex justify-between items-center z-20 border-b border-[#1E1E26] bg-[#0A0A0F]">
          <div className="flex items-center gap-3.5">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
                title="Open sidebar"
              >
                <Menu size={18} />
              </button>
            )}
            
            {/* Dark squircle with sparkle */}
            <div className="w-8 h-8 rounded-lg bg-[#201A0C] border border-[#FFC94A]/20 flex items-center justify-center text-[#FFC94A] text-sm shrink-0">
              ✦
            </div>

            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-none mb-1">New Chat</h2>
              <p className="text-[11px] text-[#7E7E90] leading-none">Powered by Atlas 5 Intelligent Reasoning</p>
            </div>
          </div>

          {/* Right Header items: ATLAS 5 pill + Web Chat button */}
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-[#201A0C] border border-[#FFC94A]/30 text-[#FFC94A] text-[10.5px] font-bold tracking-wider uppercase">
              ATLAS 5
            </div>

            <button
              onClick={() => {
                window.open('https://xalme.xoeris.com/chat', '_blank');
              }}
              className="px-3.5 py-1.5 rounded-lg border border-[#323240] bg-[#14141B] hover:bg-[#1A1A24] text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Web Chat</span>
              <ExternalLink size={12} className="text-gray-400" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden relative">
          
          {/* Welcome Screen or Message Stream */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full py-8 overflow-y-auto">
              
              {/* Central Glowing Squircle */}
              <div className="w-16 h-16 rounded-[22px] bg-[#201A0C] border border-[#FFC94A]/25 flex items-center justify-center text-[#FFC94A] text-3xl mb-6 shadow-[0_0_35px_rgba(255,201,74,0.12)]">
                ✦
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-center mb-2">
                What will you create today?
              </h1>
              <p className="text-xs md:text-sm text-[#7E7E90] text-center mb-8">
                Think it through. Build something great. Ask Xalme.
              </p>

              {/* 2x2 Grid of Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                {[
                  {
                    icon: '⌘',
                    title: 'System Architecture',
                    desc: 'Plan robust schemas, service layouts and APIs.',
                    prompt: 'Help me design the architecture for a scalable, high-concurrency microservice system.'
                  },
                  {
                    icon: '⌥',
                    title: 'Refactor Code',
                    desc: 'Simplify implementations and optimize bottlenecks.',
                    prompt: 'Help me refactor this code for maximum clarity, idiomatic style, and performance.'
                  },
                  {
                    icon: '✦',
                    title: 'Explain Concepts',
                    desc: 'Deep dive into algorithms, protocols and math.',
                    prompt: 'Explain zero-knowledge rollups and practical zk-SNARK mathematical concepts.'
                  },
                  {
                    icon: '◇',
                    title: 'Security Review',
                    desc: 'Identify exploit vectors and reinforce defenses.',
                    prompt: 'Review common security vulnerabilities and exploit vectors in modern token authentication.'
                  }
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(card.prompt)}
                    className="p-4 rounded-2xl bg-[#16161E] hover:bg-[#1C1C26] border border-[#252532] hover:border-[#383848] text-left transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[#FFC94A] text-sm font-bold">{card.icon}</span>
                      <span className="text-xs font-semibold text-[#FFC94A]">{card.title}</span>
                    </div>
                    <p className="text-[11px] text-[#7E7E90] leading-relaxed">{card.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Message History */
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 max-w-3xl mx-auto w-full">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-[#201A0C] border border-[#FFC94A]/25 flex items-center justify-center shrink-0 mt-0.5 text-[#FFC94A] text-xs">
                      ✦
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed text-xs md:text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#1C180E] border border-[#FFC94A]/40 text-white shadow-[0_0_15px_rgba(255,201,74,0.06)]'
                        : msg.content.startsWith('[XALME SYSTEM ALERT]')
                          ? 'bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs'
                          : 'bg-[#16161E] border border-[#262634] text-[#F0F0F5] whitespace-pre-wrap'
                    }`}
                  >
                    {msg.role === 'assistant' && !msg.content.startsWith('[XALME SYSTEM ALERT]') && (
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5 text-[11px]">
                        <span className="text-[#FFC94A] font-bold">Xalme (Atlas 5)</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.content, index)}
                          className="hover:text-white flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-gray-400"
                        >
                          {copiedIndex === index ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-xs text-gray-400 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#FFC94A] animate-ping" />
                  <span className="font-mono">{statusText || 'Xalme is synthesizing response...'}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Composer Box */}
          <div className="p-4 md:p-6 bg-[#0A0A0F] border-t border-[#1C1C24] z-20">
            <div className="max-w-3xl mx-auto w-full">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="bg-[#161622] border border-[#2B2B38] focus-within:border-[#FFC94A]/60 rounded-2xl p-4 shadow-2xl transition-all"
              >
                <textarea
                  ref={textareaRef}
                  rows={2}
                  placeholder="Ask Xalme anything, explore ideas or write code..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleTextareaKeyDown}
                  disabled={loading}
                  className="w-full bg-transparent text-[#F0F0F5] placeholder:text-[#585868] text-sm resize-none outline-none border-none leading-relaxed font-sans max-h-36"
                />

                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-md bg-[#201A0C] border border-[#FFC94A]/20 text-[#FFC94A] text-xs font-semibold flex items-center gap-1.5">
                      <span>✦</span>
                      <span>Atlas 5 Reasoning</span>
                    </div>
                    <span className="text-[11px] text-[#545464] hidden sm:inline ml-2">
                      Press Enter to send · Shift+Enter for new line
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1.5 ${
                      input.trim()
                        ? 'bg-[#FFC94A] hover:bg-[#FFD46A] text-[#0A0A0F] shadow-[0_0_15px_rgba(255,201,74,0.3)] active:scale-95'
                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <span>Send</span>
                    <span>↑</span>
                  </button>
                </div>
              </form>

              {/* Centered Disclaimer */}
              <p className="text-[10px] text-[#464654] text-center mt-2.5">
                Xalme Desktop AI can make mistakes. Verify critical facts and code output.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14141A] border border-[#2E2E38] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2.5 mb-5">
              <Settings size={18} className="text-[#FFC94A]" />
              <h3 className="text-base font-bold text-white">Settings</h3>
            </div>
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">Theme</p>
                  <p className="text-[#7E7E90] text-[11px]">Dark Obsidian (APEX Yellow)</p>
                </div>
                <span className="px-2 py-1 rounded bg-[#201A0C] text-[#FFC94A] font-bold text-[10px]">Active</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">Active Reasoning Model</p>
                  <p className="text-[#7E7E90] text-[11px]">Atlas 5 (Deep Reasoning)</p>
                </div>
                <span className="px-2 py-1 rounded bg-[#201A0C] text-[#FFC94A] font-bold text-[10px]">Atlas 5</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">User Account</p>
                  <p className="text-[#7E7E90] text-[11px]">{currentUser?.email || 'admin@xoeris.com'}</p>
                </div>
                <span className="px-2 py-1 rounded bg-[#201A0C] text-[#FFC94A] font-bold text-[10px]">Pro Edition</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#FFC94A] text-black font-bold text-xs cursor-pointer border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14141A] border border-[#2E2E38] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fade-in text-center">
            <button
              onClick={() => setAboutOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#201A0C] border border-[#FFC94A]/30 flex items-center justify-center text-[#FFC94A] text-2xl mx-auto mb-3">
              ✦
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Xalme</h3>
            <p className="text-xs text-[#7E7E90] mb-4">Version 1.0.0 · Desktop Web Edition</p>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Xalme is the intelligent reasoning assistant built by Xoeris for architecture, engineering, and deep conceptual planning.
            </p>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-left text-xs mb-6 space-y-1">
              <p className="text-[#7E7E90]">Account: <span className="text-white font-medium">{currentUser?.email || 'admin@xoeris.com'}</span></p>
              <p className="text-[#7E7E90]">Status: <span className="text-[#6DBE47] font-bold">Licensed (Pro)</span></p>
            </div>
            <button
              onClick={() => setAboutOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#FFC94A] text-black font-bold text-xs cursor-pointer border-none"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}