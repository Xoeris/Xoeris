import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, RefreshCw, LogIn, Mail, Lock, ShieldAlert, Cpu, Sparkles, Check, Globe, Plus, Compass, ChevronDown, Menu, User, Settings, FolderOpen, Code, MessageSquare } from 'lucide-react';

import AuthPage from './AuthPage';

const PUBLIC_API_KEY = import.meta.env.VITE_XOERIS_PUBLIC_KEY || '';

export default function ChatPage({ onNavigate }) {
  // Check for Xoeris auth token or chat auth
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = Boolean(localStorage.getItem('xoeris_token'));
    const hasChatAuth = localStorage.getItem('xoeris_chat_auth') === 'true';
    return hasToken || hasChatAuth;
  });

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xalme assistant ready. Enter your prompt to begin.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check if token was provided in URL query parameters
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('xoeris_token', urlToken);
      localStorage.setItem('xoeris_chat_auth', 'true');
      setIsAuthenticated(true);
      // Clean query params from URL
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const authenticated = Boolean(localStorage.getItem('xoeris_token')) ||
        localStorage.getItem('xoeris_chat_auth') === 'true';
      setIsAuthenticated(authenticated);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('xoeris_chat_auth');
    localStorage.removeItem('xoeris_token');
    localStorage.removeItem('xoeris_user');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!PUBLIC_API_KEY) {
      setStatusText('Chat is temporarily unavailable (missing client key).');
      return;
    }

    const userMessage = input.trim();
    setInput('');
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

      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative top-0 bottom-0 left-0 ${
        sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
      } border-r border-white/10 bg-black/90 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 overflow-hidden z-50 shrink-0 h-full`}>
        <div>
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer">
              <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="h-6 w-24 object-contain object-left" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FDD935]">Xalme</span>
            </button>
          </div>

          {/* Quick actions */}
          <div className="p-4">
            <button 
              onClick={() => setMessages([{ role: 'assistant', content: 'Xalme execution core active. Send query to begin.' }])}
              className="w-full py-3 px-4 bg-white/[0.04] border border-white/10 hover:border-[#FDD935]/40 hover:bg-white/[0.08] rounded-xl flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-white"
            >
              <Plus size={14} className="text-[#FDD935]" />
              New session
            </button>
          </div>

          {/* Sidebar Menu items */}
          <nav className="px-3 py-2 flex flex-col gap-1">
            <button className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider bg-white/[0.06] text-white text-left border border-white/10 cursor-pointer">
              <MessageSquare size={14} className="text-[#FDD935]" />
              Assistant Chat
            </button>
            <button disabled className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-600 text-left cursor-not-allowed bg-transparent border-none">
              <FolderOpen size={14} />
              Artifacts
            </button>
            <button disabled className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-600 text-left cursor-not-allowed bg-transparent border-none">
              <Code size={14} />
              Model Code
            </button>
          </nav>
        </div>

        {/* User Card footer inside Sidebar */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#FDD935]/15 border border-[#FDD935]/30 flex items-center justify-center text-[#FDD935]">
              <User size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold uppercase tracking-wide truncate text-gray-200">Operator</span>
              <span className="text-[10px] font-medium text-gray-500 truncate">dev@xoeris.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-red-300"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen w-full relative z-10">
        
        {/* Top Header */}
        <header className="border-b border-white/10 bg-black/70 backdrop-blur-md px-6 py-4 flex justify-between items-center z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Xalme // Chat Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active status */}
            <div className="hidden sm:flex items-center gap-2 bg-[#FDD935]/10 border border-[#FDD935]/30 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#FDD935] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDD935]">Connected</span>
            </div>
          </div>
        </header>

        {/* Main Chat Feed */}
        <main className="flex-grow flex flex-col justify-between overflow-hidden relative">
          
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {msg.role === 'user' ? 'Operator' : 'Xalme'}
                </div>
                <div
                  className={`px-5 py-3.5 rounded-2xl leading-relaxed text-sm font-medium border ${msg.role === 'user'
                      ? 'bg-[#FDD935]/15 border-[#FDD935]/30 text-white rounded-tr-none shadow-[0_0_15px_rgba(253,217,53,0.1)]'
                      : msg.content.startsWith('[ERROR]')
                        ? 'bg-red-500/10 border-red-500/20 text-red-400 rounded-tl-none font-mono text-xs'
                        : 'bg-white/[0.04] border-white/10 text-gray-200 rounded-tl-none'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <RefreshCw size={14} className="animate-spin text-[#FDD935]" />
                {statusText || 'Syncing...'}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar Form */}
          <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto liquid-glass-panel border border-white/15 rounded-3xl p-3 flex flex-col gap-3 shadow-2xl" style={{ backdropFilter: 'blur(28px) saturate(180%)' }}>
              {/* Action Bar Header */}
              <div className="flex items-center justify-between px-3 pt-2">
                <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 px-3 py-1.5 rounded-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FDD935]">Model: Xalme-1.1</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-500 cursor-not-allowed hover:text-white transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-500 cursor-not-allowed hover:text-white transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  </div>
                </div>
              </div>

              {/* Input Message Area */}
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3">
                <input
                  type="text"
                  placeholder="Ask a follow-up..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="flex-grow bg-transparent text-sm font-medium outline-none border-none text-white placeholder:text-gray-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-[#FDD935] hover:bg-[#FFE066] active:scale-95 disabled:scale-100 disabled:opacity-50 text-black p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer border-none shadow-[0_0_15px_rgba(253,217,53,0.3)]"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}