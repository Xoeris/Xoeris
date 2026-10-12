import React, { useState, useRef, useEffect } from 'react';
import {
  Send, ArrowLeft, RefreshCw, Plus, ChevronDown, User,
  Search, Folder, Layout, Sliders, SlidersHorizontal, Mic,
  AudioWaveform, ArrowUp, PanelLeft, Sparkles, MessageSquare,
  LogOut, ExternalLink, X
} from 'lucide-react';

import AuthPage from './AuthPage';
import { getStoredUser, clearSession } from './services/authService';

const PUBLIC_API_KEY = import.meta.env.VITE_XOERIS_PUBLIC_KEY || '';

// Authentic Claude sunburst asterisk icon
function ClaudeSpark({ className = "w-7 h-7 text-[#D97706]" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 2.5c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V4c0-.83.67-1.5 1.5-1.5zm0 18c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5zm13.5-6c0 .83-.67 1.5-1.5 1.5h-4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h4c.83 0 1.5.67 1.5 1.5zm-18 0c0 .83-.67 1.5-1.5 1.5H6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h4c.83 0 1.5.67 1.5 1.5zm14.05-9.55a1.5 1.5 0 0 1 0 2.12l-2.83 2.83a1.5 1.5 0 0 1-2.12-2.12l2.83-2.83a1.5 1.5 0 0 1 2.12 0zm-12.73 12.73a1.5 1.5 0 0 1 0 2.12l-2.83 2.83a1.5 1.5 0 0 1-2.12-2.12l2.83-2.83a1.5 1.5 0 0 1 2.12 0zm12.73 0a1.5 1.5 0 0 1-2.12 0l-2.83-2.83a1.5 1.5 0 0 1 2.12-2.12l2.83 2.83a1.5 1.5 0 0 1 0 2.12zm-12.73-12.73a1.5 1.5 0 0 1-2.12 0l-2.83-2.83a1.5 1.5 0 0 1 2.12-2.12l2.83 2.83a1.5 1.5 0 0 1 0 2.12z" />
    </svg>
  );
}

export default function ChatPage({ onNavigate }) {
  // Check for Xoeris auth token or chat auth
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = Boolean(localStorage.getItem('xoeris_token'));
    const hasChatAuth = localStorage.getItem('xoeris_chat_auth') === 'true';
    return hasToken || hasChatAuth;
  });

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Sonnet 3.5');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Check if token was provided in URL query parameters
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('xoeris_token', urlToken);
      localStorage.setItem('xoeris_chat_auth', 'true');
      setIsAuthenticated(true);
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const authenticated = Boolean(localStorage.getItem('xoeris_token')) ||
        localStorage.getItem('xoeris_chat_auth') === 'true';
      setIsAuthenticated(authenticated);
    }
    setCurrentUser(getStoredUser());
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

  const userName = currentUser?.name || currentUser?.username || 'Pecel';

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    if (!PUBLIC_API_KEY) {
      setStatusText('Chat is temporarily unavailable (missing client key).');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setStatusText('Routing through api.xoeris.com...');

    try {
      const response = await fetch('https://api.xoeris.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PUBLIC_API_KEY}`
        },
        body: JSON.stringify({
          messages: [
            ...messages.filter(m => m.role !== 'system'),
            { role: 'user', content: userMessage }
          ],
          max_new_tokens: 512,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content || 'No response payload received.';
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);
      setStatusText('');
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `[ERROR] ${err.message}` }]);
      setStatusText('Execution failed.');
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
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
    <div className="min-h-screen bg-[#1f1e1d] text-[#ECE7DE] flex font-sans selection:bg-[#D97706]/30 selection:text-white overflow-hidden relative">
      
      {/* Claude Sidebar */}
      <aside
        className={`fixed md:relative top-0 bottom-0 left-0 ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-0'
        } border-r border-[#2c2a27] bg-[#181715] flex flex-col justify-between transition-all duration-300 overflow-hidden z-50 shrink-0 h-full`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header: Collapse icon + Claude / Xalme title */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-[#262421]">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[#9A9488] hover:text-[#ECE7DE] p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none"
                title="Close sidebar"
              >
                <PanelLeft size={18} />
              </button>
              <button
                onClick={() => onNavigate ? onNavigate('xoeris') : window.location.href = 'https://xoeris.com'}
                className="font-serif text-xl tracking-tight text-[#ECE7DE] hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer text-left flex items-center gap-2"
              >
                <span>Claude</span>
              </button>
            </div>
            <button
              onClick={() => onNavigate ? onNavigate('xoeris') : window.location.href = 'https://xoeris.com'}
              className="text-[11px] text-[#7A7468] hover:text-[#ECE7DE] bg-transparent border-none p-0 cursor-pointer"
              title="Return to xoeris.com"
            >
              <ExternalLink size={13} />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {/* Search Pill Button */}
            <button
              onClick={() => {}}
              className="w-full py-1.5 px-3 bg-[#262522] hover:bg-[#2e2d29] border border-[#383632]/60 rounded-xl text-xs text-[#8C877C] flex items-center gap-2 transition-colors cursor-pointer text-left"
            >
              <Search size={14} className="text-[#8C877C]" />
              <span>Search</span>
            </button>

            {/* + New Button */}
            <button
              onClick={() => {
                setMessages([]);
                setInput('');
              }}
              className="w-full py-2 px-3 bg-[#262522] hover:bg-[#2e2d29] border border-[#383632]/60 rounded-xl text-sm font-semibold text-[#ECE7DE] flex items-center gap-2 transition-colors cursor-pointer text-left"
            >
              <Plus size={16} className="text-[#ECE7DE]" />
              <span>New</span>
            </button>
          </div>

          {/* Primary Navigation Items */}
          <div className="px-3 py-1 space-y-0.5">
            <button className="w-full px-3 py-2 rounded-xl text-xs font-medium text-[#C5BFAF] hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer bg-transparent border-none text-left">
              <Folder size={15} className="text-[#8C877C]" />
              <span>Projects</span>
            </button>
            <button className="w-full px-3 py-2 rounded-xl text-xs font-medium text-[#C5BFAF] hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer bg-transparent border-none text-left">
              <Layout size={15} className="text-[#8C877C]" />
              <span>Artifacts</span>
            </button>
            <button className="w-full px-3 py-2 rounded-xl text-xs font-medium text-[#C5BFAF] hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer bg-transparent border-none text-left">
              <SlidersHorizontal size={15} className="text-[#8C877C]" />
              <span>Customize</span>
            </button>
          </div>

          {/* Pinned & Older Chats Section */}
          <div className="flex-1 px-3 py-2 overflow-y-auto space-y-4">
            {/* Pinned Section */}
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-[#6e685f] uppercase tracking-wider">
                Pinned
              </div>
              <button className="w-full px-2.5 py-1.5 rounded-lg text-xs text-[#C5BFAF] hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none text-left truncate">
                <Folder size={14} className="text-[#8C877C] shrink-0" />
                <span className="truncate">IA BISMILLAH</span>
              </button>
            </div>

            {/* Older Section */}
            <div>
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold text-[#6e685f] uppercase tracking-wider">
                <span>Older</span>
                <SlidersHorizontal size={12} className="cursor-pointer hover:text-[#C5BFAF]" />
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => {
                    setMessages([
                      { role: 'user', content: 'Ide Ilustrasi Legenda Lau Kawar' },
                      { role: 'assistant', content: 'Berikut adalah eksplorasi konsep ilustrasi untuk kisah legenda Danau Lau Kawar di Tanah Karo, Sumatera Utara:\n\n1. Nuansa Visual: Palet warna dramatis dengan gradasi senja pegunungan Sinabung.\n2. Elemen Simbolis: Sosok sang ibu yang menangis dan riak air danau yang perlahan menenggelamkan desa.' }
                    ]);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs text-[#C5BFAF] hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none text-left truncate"
                >
                  <span className="truncate">Ide Ilustrasi Legenda Lau Kawar</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Card footer inside Sidebar */}
          <div className="p-3 border-t border-[#262421] relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-full p-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors cursor-pointer bg-transparent border-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="User" className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#E08D79] text-white text-xs font-bold flex items-center justify-center shrink-0 uppercase">
                    {(userName)[0]}
                  </div>
                )}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-medium text-[#ECE7DE] truncate">{userName}</span>
                  <span className="text-[11px] text-[#8C877C]">· Free</span>
                  <ChevronDown size={13} className="text-[#8C877C] shrink-0" />
                </div>
              </div>
              <Sliders size={14} className="text-[#8C877C] shrink-0" />
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#262522] border border-[#383632] rounded-2xl p-2 shadow-2xl z-50 text-left animate-fade-in">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-[#8C877C] truncate">{currentUser?.email || 'user@xoeris.com'}</p>
                </div>
                <button
                  onClick={() => { setUserDropdownOpen(false); if (onNavigate) onNavigate('subscriptions'); }}
                  className="w-full px-3 py-2 text-xs text-[#C5BFAF] hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
                >
                  <span>Upgrade Plan</span>
                  <span className="text-[10px] text-[#D97706] font-semibold">Pro</span>
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen w-full relative z-10 bg-[#1f1e1d]">
        
        {/* Top Minimal Bar */}
        <header className="h-14 px-6 flex justify-between items-center z-30">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-[#9A9488] hover:text-[#ECE7DE] bg-transparent border-none cursor-pointer"
                title="Open sidebar"
              >
                <PanelLeft size={18} />
              </button>
            )}
          </div>

          {/* Center Plan text */}
          <div className="text-xs text-[#8C877C] flex items-center gap-1.5 font-sans">
            <span>Free plan</span>
            <span>·</span>
            <button
              onClick={() => onNavigate ? onNavigate('subscriptions') : window.location.href = '/subscription'}
              className="text-[#ECE7DE] hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
            >
              Upgrade
            </button>
          </div>

          {/* Top Right Profile Icon / Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#9A9488] hover:text-[#ECE7DE] hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
              title="Account settings"
            >
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User size={18} />
              )}
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden relative">
          
          {/* Messages Feed or Initial Welcome View */}
          {messages.length === 0 ? (
            /* Claude Welcome Center Stage matching screenshot */
            <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-10">
              {/* Sunburst Asterisk + Greeting */}
              <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <ClaudeSpark className="w-8 h-8 text-[#D97706]" />
                <h1 className="font-serif text-3xl md:text-4xl text-[#ECE7DE] tracking-tight font-normal">
                  {getGreeting()}, {userName}
                </h1>
              </div>

              {/* Centered Input Card */}
              <div className="w-full max-w-2xl">
                <form
                  onSubmit={handleSend}
                  className="bg-[#262522] border border-[#393632] focus-within:border-[#4f4c45] rounded-2xl p-4 shadow-xl transition-all"
                >
                  <textarea
                    ref={textareaRef}
                    rows={3}
                    placeholder="How can I help you today?"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleTextareaKeyDown}
                    disabled={loading}
                    className="w-full bg-transparent text-[#ECE7DE] placeholder:text-[#8a8479] text-base resize-none outline-none border-none leading-relaxed font-sans"
                  />

                  {/* Inside Card Bottom Toolbar */}
                  <div className="flex items-center justify-between pt-2 mt-1">
                    <button
                      type="button"
                      className="p-1.5 text-[#9A9488] hover:text-[#ECE7DE] hover:bg-white/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                      title="Add content"
                    >
                      <Plus size={18} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="p-1.5 text-[#9A9488] hover:text-[#ECE7DE] hover:bg-white/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                        title="Voice mode"
                      >
                        <Mic size={17} />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 text-[#9A9488] hover:text-[#ECE7DE] hover:bg-white/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                        title="Audio wave"
                      >
                        <AudioWaveform size={17} />
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={`p-2 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center ${
                          input.trim()
                            ? 'bg-[#E5DFD5] text-[#1f1e1d] hover:bg-white shadow-sm'
                            : 'bg-[#33312d] text-[#6e695f] cursor-not-allowed'
                        }`}
                        title="Send message"
                      >
                        <ArrowUp size={16} />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Below Card Meta Row */}
                <div className="flex items-center justify-between px-2 pt-2 text-xs text-[#8A8479]">
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-[#ECE7DE] transition-colors cursor-pointer bg-transparent border-none p-0 text-[#8A8479]"
                  >
                    <span>Project</span>
                    <ChevronDown size={12} />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                        className="hover:text-[#ECE7DE] transition-colors cursor-pointer bg-transparent border-none p-0 text-[#8A8479] flex items-center gap-1"
                      >
                        <span>{selectedModel}</span>
                      </button>
                      {modelDropdownOpen && (
                        <div className="absolute right-0 bottom-full mb-2 bg-[#262522] border border-[#383632] rounded-xl p-1.5 shadow-2xl z-50 text-left min-w-[130px]">
                          {['Sonnet 3.5', 'Elarion 1.1', 'Nebula', 'Atlas'].map((m) => (
                            <button
                              key={m}
                              onClick={() => { setSelectedModel(m); setModelDropdownOpen(false); }}
                              className={`w-full px-2.5 py-1.5 rounded-lg text-xs text-left cursor-pointer border-none ${
                                selectedModel === m ? 'bg-white/10 text-white font-medium' : 'text-[#C5BFAF] hover:bg-white/5 bg-transparent'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[#686359]">Medium</span>
                    <span className="text-[#686359]">Manual</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Active Conversation Feed */
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 max-w-3xl mx-auto w-full">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <ClaudeSpark className="w-5 h-5 text-[#D97706]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#2b2a27] border border-[#3b3934] text-[#ECE7DE]'
                        : msg.content.startsWith('[ERROR]')
                          ? 'bg-red-500/10 border border-red-500/20 text-red-300 font-mono text-xs'
                          : 'text-[#ECE7DE] leading-relaxed whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2.5 text-xs text-[#9A9488]">
                  <ClaudeSpark className="w-5 h-5 text-[#D97706] animate-pulse" />
                  <span>{statusText || 'Claude is thinking...'}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Dock Input (only visible when conversation is active) */}
          {messages.length > 0 && (
            <div className="p-4 md:p-6 bg-gradient-to-t from-[#1f1e1d] via-[#1f1e1d]/90 to-transparent z-20">
              <div className="max-w-3xl mx-auto w-full">
                <form
                  onSubmit={handleSend}
                  className="bg-[#262522] border border-[#393632] focus-within:border-[#4f4c45] rounded-2xl p-3 shadow-xl transition-all"
                >
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder="Reply to Claude..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleTextareaKeyDown}
                    disabled={loading}
                    className="w-full bg-transparent text-[#ECE7DE] placeholder:text-[#8a8479] text-sm resize-none outline-none border-none leading-relaxed font-sans max-h-36"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      className="p-1.5 text-[#9A9488] hover:text-[#ECE7DE] hover:bg-white/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                    >
                      <Plus size={16} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="p-1.5 text-[#9A9488] hover:text-[#ECE7DE] hover:bg-white/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                      >
                        <Mic size={16} />
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={`p-2 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center ${
                          input.trim()
                            ? 'bg-[#E5DFD5] text-[#1f1e1d] hover:bg-white shadow-sm'
                            : 'bg-[#33312d] text-[#6e695f] cursor-not-allowed'
                        }`}
                      >
                        <ArrowUp size={15} />
                      </button>
                    </div>
                  </div>
                </form>

                <div className="flex items-center justify-between px-2 pt-1.5 text-[11px] text-[#8A8479]">
                  <span>Project ▾</span>
                  <span>{selectedModel} · Medium · Manual</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}