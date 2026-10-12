import React, { useState, useRef, useEffect } from 'react';
import {
  Send, ArrowLeft, RefreshCw, Plus, ChevronDown, User,
  Search, Folder, Layout, SlidersHorizontal, Mic,
  AudioWaveform, ArrowUp, PanelLeft, Sparkles, MessageSquare,
  LogOut, ExternalLink, X, Trash2, Copy, Check, Terminal, Cpu, Code
} from 'lucide-react';

import AuthPage from './AuthPage';
import { getStoredUser, getStoredToken, setSession, clearSession, syncUserFromDatabase } from './services/authService';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Xalme 3.5 Core');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

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
      syncUserFromDatabase().catch(() => null);
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
      syncUserFromDatabase().then((user) => {
        if (user) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        }
      }).catch(() => null);
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

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-[#FDD935] selection:text-black overflow-hidden relative">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(253,217,53,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>

      {/* Cyber ambient glow blobs */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-20">
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] bg-[#FDD935]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] bg-[#FFC94A]/10 rounded-full blur-[140px]" />
      </div>

      {/* Xoeris Xalme Sidebar */}
      <aside
        className={`fixed md:relative top-0 bottom-0 left-0 ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-0'
        } border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 overflow-hidden z-50 shrink-0 h-full`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header: Collapse icon + Xalme title */}
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none"
                title="Collapse sidebar"
              >
                <PanelLeft size={18} />
              </button>
              <button
                onClick={() => { window.location.href = 'https://xoeris.com'; }}
                className="flex items-center gap-2 group bg-transparent border-none p-0 cursor-pointer text-left"
              >
                <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="h-5 w-auto object-contain transition-transform group-hover:scale-105" />
                <span className="font-black text-lg tracking-wider text-white">Xalme</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#FDD935]/15 text-[#FDD935] border border-[#FDD935]/30">AI</span>
              </button>
            </div>
            <button
              onClick={() => { window.location.href = 'https://xoeris.com'; }}
              className="text-gray-400 hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer"
              title="Return to xoeris.com"
            >
              <ExternalLink size={14} />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="p-3 space-y-2 border-b border-white/5">
            {/* + New Chat Button in Xoeris Electric Yellow */}
            <button
              onClick={handleStartNewChat}
              className="w-full py-2.5 px-3.5 bg-[#FDD935] hover:bg-[#FFE066] text-black font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-[0_0_15px_rgba(253,217,53,0.3)] hover:shadow-[0_0_20px_rgba(253,217,53,0.5)] active:scale-[0.98]"
            >
              <Plus size={16} className="text-black stroke-[3]" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Real Chat History Section (NO FAKE PLACEHOLDERS) */}
          <div className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between px-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Recent Sessions</span>
              <span className="text-[10px] font-mono text-gray-600">{threads.length}</span>
            </div>

            {threads.length === 0 ? (
              <div className="px-3 py-8 text-center text-gray-500 text-xs">
                <MessageSquare size={20} className="mx-auto mb-2 opacity-30 text-[#FDD935]" />
                <p>No recent sessions</p>
                <p className="text-[11px] text-gray-600 mt-1">Start a conversation with Xalme</p>
              </div>
            ) : (
              <div className="space-y-1">
                {threads.map((thread) => {
                  const isActive = thread.id === currentThreadId;
                  return (
                    <div
                      key={thread.id}
                      onClick={() => handleSelectThread(thread.id)}
                      className={`group w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-white/[0.06] border-[#FDD935]/40 text-white font-semibold shadow-[0_0_12px_rgba(253,217,53,0.1)]'
                          : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MessageSquare size={13} className={isActive ? 'text-[#FDD935] shrink-0' : 'text-gray-500 shrink-0'} />
                        <span className="truncate">{thread.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteThread(e, thread.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 rounded transition-opacity bg-transparent border-none cursor-pointer"
                        title="Delete session"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Account Tile inside Sidebar */}
          <div className="p-3 border-t border-white/10 relative bg-black/40">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-full p-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors cursor-pointer bg-transparent border-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="User" className="w-7 h-7 rounded-full object-cover ring-1 ring-[#FDD935]/50" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#FDD935] text-black text-xs font-black flex items-center justify-center shrink-0 uppercase shadow-[0_0_10px_rgba(253,217,53,0.3)]">
                    {(userName)[0]}
                  </div>
                )}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-white truncate">{userName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-gray-400">
                    {currentUser?.subscription_tier === 'pro' ? 'PRO' : 'FREE'}
                  </span>
                  <ChevronDown size={13} className="text-gray-400 shrink-0" />
                </div>
              </div>
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#111111] border border-white/15 rounded-2xl p-2 shadow-2xl z-50 text-left animate-fade-in backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-gray-400 truncate">{currentUser?.email || 'developer@xoeris.com'}</p>
                </div>
                <button
                  onClick={() => { setUserDropdownOpen(false); if (onNavigate) onNavigate('pricing'); }}
                  className="w-full px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
                >
                  <span>Pricing & Plans</span>
                  <span className="text-[10px] text-[#FDD935] font-black uppercase">PRO</span>
                </button>
                <button
                  onClick={() => { setUserDropdownOpen(false); handleLogout(); }}
                  className="w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-2 cursor-pointer bg-transparent border-none text-left"
                >
                  <LogOut size={13} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen w-full relative z-10 bg-[#050505]">
        
        {/* Top Minimal Bar */}
        <header className="h-14 px-6 flex justify-between items-center z-30 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
                title="Open sidebar"
              >
                <PanelLeft size={18} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">Xalme Console</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FDD935] animate-pulse" />
            </div>
          </div>

          {/* Center Plan Link */}
          <div className="text-xs text-gray-400 flex items-center gap-2 font-mono">
            <span className="text-gray-500">Plan:</span>
            <button
              onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#FDD935]/50 text-white hover:text-[#FDD935] font-semibold transition-all cursor-pointer text-xs"
            >
              {currentUser?.subscription_tier === 'pro' ? 'Pro Member' : 'Free Tier · Upgrade'}
            </button>
          </div>

          {/* Top Right Profile Icon / Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
              title="Account settings"
            >
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full object-cover ring-1 ring-[#FDD935]/40" />
              ) : (
                <User size={18} />
              )}
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden relative">
          
          {/* Welcome Screen or Message Feed */}
          {messages.length === 0 ? (
            /* Xalme Welcome Center Stage in Xoeris Design */
            <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full -mt-8">
              
              {/* Xalme Sunburst Emblem + Greeting */}
              <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-[#FDD935]/10 border border-[#FDD935]/30 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(253,217,53,0.15)]">
                  <XalmeSpark className="w-8 h-8 text-[#FDD935]" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
                  {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#FFC94A]">{userName}</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-lg">
                  What would you like to build or explore today with Xalme AI?
                </p>
              </div>

              {/* Centered Floating Input Card in Xoeris Aesthetics */}
              <div className="w-full">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="bg-[#0e0e0e] border border-white/15 focus-within:border-[#FDD935]/50 focus-within:shadow-[0_0_30px_rgba(253,217,53,0.12)] rounded-2xl p-4 transition-all backdrop-blur-xl"
                >
                  <textarea
                    ref={textareaRef}
                    rows={3}
                    placeholder="Ask Xalme anything or brainstorm code..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleTextareaKeyDown}
                    disabled={loading}
                    className="w-full bg-transparent text-white placeholder:text-gray-500 text-base resize-none outline-none border-none leading-relaxed font-sans"
                  />

                  {/* Inside Card Bottom Toolbar */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Cpu size={13} className="text-[#FDD935]" />
                        <span>{selectedModel}</span>
                        <ChevronDown size={12} className="text-gray-400" />
                      </button>

                      {modelDropdownOpen && (
                        <div className="absolute left-4 bottom-14 bg-[#141414] border border-white/15 rounded-xl p-1.5 shadow-2xl z-50 text-left min-w-[170px] backdrop-blur-2xl">
                          {['Xalme 3.5 Core', 'Xalme Opus', 'Elarion 1.1', 'Nebula Code'].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => { setSelectedModel(m); setModelDropdownOpen(false); }}
                              className={`w-full px-3 py-2 rounded-lg text-xs text-left cursor-pointer border-none flex items-center justify-between ${
                                selectedModel === m ? 'bg-[#FDD935]/15 text-[#FDD935] font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5 bg-transparent'
                              }`}
                            >
                              <span>{m}</span>
                              {selectedModel === m && <Check size={12} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center ${
                          input.trim()
                            ? 'bg-[#FDD935] text-black hover:bg-[#FFE066] shadow-[0_0_15px_rgba(253,217,53,0.4)] active:scale-95'
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                        title="Send prompt"
                      >
                        <ArrowUp size={16} className={input.trim() ? 'stroke-[2.5]' : ''} />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Prompt Starters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                  {[
                    { label: 'System Design', icon: Terminal, prompt: 'Outline the system architecture for a high-concurrency event router in Go.' },
                    { label: 'Refactor Code', icon: Code, prompt: 'Refactor this async function to handle exponential backoff and timeout safely.' },
                    { label: 'Explain Concept', icon: Sparkles, prompt: 'Explain zero-knowledge rollups with intuitive diagrams and tradeoffs.' },
                    { label: 'Security Review', icon: Cpu, prompt: 'Review OAuth 2.0 PKCE implementation best practices for multi-tenant SPAs.' }
                  ].map((starter, idx) => {
                    const Icon = starter.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(starter.prompt)}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#FDD935]/40 hover:bg-white/[0.05] transition-all text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={13} className="text-[#FDD935]" />
                          <span className="text-xs font-bold text-gray-300 group-hover:text-white">{starter.label}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{starter.prompt}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Active Conversation Feed */
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 max-w-3xl mx-auto w-full">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-[#FDD935]/15 border border-[#FDD935]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#FDD935] shadow-[0_0_10px_rgba(253,217,53,0.15)]">
                      <XalmeSpark className="w-4 h-4 text-[#FDD935]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#FDD935]/10 border border-[#FDD935]/30 text-white font-sans shadow-[0_0_20px_rgba(253,217,53,0.06)]'
                        : msg.content.startsWith('[XALME SYSTEM ALERT]')
                          ? 'bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs'
                          : 'bg-white/[0.03] border border-white/10 text-gray-100 leading-relaxed whitespace-pre-wrap'
                    }`}
                  >
                    {msg.role === 'assistant' && !msg.content.startsWith('[XALME SYSTEM ALERT]') && (
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5 text-[11px] font-mono text-gray-400">
                        <span className="text-[#FDD935] font-bold">Xalme AI</span>
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
                  <div className="w-2 h-2 rounded-full bg-[#FDD935] animate-ping" />
                  <span className="font-mono">{statusText || 'Xalme is synthesizing response...'}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Dock Input (only visible when conversation is active) */}
          {messages.length > 0 && (
            <div className="p-4 md:p-6 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-20">
              <div className="max-w-3xl mx-auto w-full">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="bg-[#0e0e0e] border border-white/15 focus-within:border-[#FDD935]/50 focus-within:shadow-[0_0_30px_rgba(253,217,53,0.12)] rounded-2xl p-3.5 shadow-2xl transition-all backdrop-blur-xl"
                >
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder="Message Xalme..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleTextareaKeyDown}
                    disabled={loading}
                    className="w-full bg-transparent text-white placeholder:text-gray-500 text-sm resize-none outline-none border-none leading-relaxed font-sans max-h-36"
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                        <Cpu size={12} className="text-[#FDD935]" />
                        {selectedModel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={`p-2 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center ${
                          input.trim()
                            ? 'bg-[#FDD935] text-black hover:bg-[#FFE066] shadow-[0_0_15px_rgba(253,217,53,0.4)]'
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                        title="Send message"
                      >
                        <ArrowUp size={16} className={input.trim() ? 'stroke-[2.5]' : ''} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}