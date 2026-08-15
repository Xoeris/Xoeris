import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, RefreshCw, LogIn, Mail, Lock, ShieldAlert, Cpu, Sparkles, Check, Globe, Plus, Compass, ChevronDown, Menu, User, Settings, FolderOpen, Code, MessageSquare } from 'lucide-react';

const PUBLIC_API_KEY = import.meta.env.VITE_XOERIS_PUBLIC_KEY || '';

export default function ChatPage({ onNavigate }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('xoeris_chat_auth') === 'true';
  });
  const [authMethod, setAuthMethod] = useState(null); // null, 'email'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xalme execution core active. Send query to begin.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAuthenticated]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (emailInput === 'dev@xoeris.com' && passwordInput === '250404') {
      setIsAuthenticated(true);
      localStorage.setItem('xoeris_chat_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Access denied: Invalid operational credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('xoeris_chat_auth');
    setAuthMethod(null);
    setEmailInput('');
    setPasswordInput('');
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

  // Auth Screen Render
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#705EBC]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#F59E0B]/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Navbar */}
        <header className="px-6 py-6 flex justify-between items-center z-10">
          <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-2 group bg-transparent border-none text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Back to Core</span>
          </button>
          <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo" className="h-8 w-8 object-contain" />
        </header>

        {/* Center Card */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
          <div className="max-w-md w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            
            {/* Header info */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-[1.25rem] bg-[#705EBC]/10 border border-[#705EBC]/20 flex items-center justify-center mx-auto mb-6">
                <Cpu className="text-[#705EBC]" size={28} />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Xalme Execution Core</h1>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Authorized clearance required. Connect using credentials to access system telemetry.</p>
            </div>

            {/* Login Selection */}
            {authMethod === null ? (
              <div className="flex flex-col gap-4">
                {/* Dummy non-interactable buttons */}
                <button disabled className="w-full py-4 px-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold text-gray-600 cursor-not-allowed">
                  <svg className="h-5 w-5 opacity-40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 12.2s4.92 11.2 11.24 11.2c6.6 0 11-4.64 11-11.2 0-.756-.08-1.333-.18-1.915H12.24z"/>
                  </svg>
                  Continue with Google
                </button>
                
                <button disabled className="w-full py-4 px-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold text-gray-600 cursor-not-allowed">
                  <svg className="h-5 w-5 opacity-40" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
                  </svg>
                  Continue with GitHub
                </button>

                <div className="relative my-4 flex items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Or</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* Interactable Email Button */}
                <button
                  onClick={() => setAuthMethod('email')}
                  className="w-full py-4 px-6 bg-white text-black rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  <Mail size={16} />
                  Access via Credentials
                </button>
              </div>
            ) : (
              /* Email Credentials Input Form */
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Secure Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 text-gray-500" size={16} />
                    <input
                      type="email"
                      required
                      placeholder="dev@xoeris.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm font-medium outline-none focus:border-[#705EBC]/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Security Clearance</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 text-gray-500" size={16} />
                    <input
                      type="password"
                      required
                      placeholder="Clearance Key"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm font-medium outline-none focus:border-[#705EBC]/40 transition-colors"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center gap-2 text-xs text-red-400 font-bold bg-red-500/5 border border-red-500/10 p-4 rounded-2xl">
                    <ShieldAlert size={16} />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod(null); setAuthError(''); }}
                    className="flex-1 py-4 bg-transparent border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#705EBC] hover:bg-[#5b4aa6] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-colors shadow-[0_10px_30px_rgba(112,94,188,0.2)]"
                  >
                    Authorize
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest z-10">
          © 2026 Xoeris. Protected Infrastructure.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex font-sans selection:bg-[#705EBC]/30 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative top-0 bottom-0 left-0 ${
        sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
      } border-r border-white/5 bg-[#0a0a0c] flex flex-col justify-between transition-all duration-300 overflow-hidden z-50 shrink-0 h-full`}>
        <div>
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <button onClick={() => onNavigate('xoeris')} className="flex items-center gap-2.5">
              <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="h-6 w-6 object-contain" />
              <span className="text-xs font-black uppercase tracking-wider text-white">Xalme AI</span>
            </button>
          </div>

          {/* Quick actions */}
          <div className="p-4">
            <button 
              onClick={() => setMessages([{ role: 'assistant', content: 'Xalme execution core active. Send query to begin.' }])}
              className="w-full py-3 px-4 bg-white/[0.03] border border-white/5 hover:border-[#705EBC]/30 hover:bg-white/[0.05] rounded-xl flex items-center gap-2.5 text-xs font-black uppercase tracking-widest transition-all"
            >
              <Plus size={14} className="text-[#705EBC]" />
              New session
            </button>
          </div>

          {/* Sidebar Menu items */}
          <nav className="px-3 py-2 flex flex-col gap-1">
            <button className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-black uppercase tracking-wider bg-white/[0.02] text-white text-left">
              <MessageSquare size={14} className="text-[#705EBC]" />
              Telemetry Chat
            </button>
            <button disabled className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-600 text-left cursor-not-allowed">
              <FolderOpen size={14} />
              Artifacts
            </button>
            <button disabled className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-600 text-left cursor-not-allowed">
              <Code size={14} />
              Model Code
            </button>
          </nav>
        </div>

        {/* User Card footer inside Sidebar */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.01]">
            <div className="w-8 h-8 rounded-lg bg-[#705EBC]/10 flex items-center justify-center text-[#705EBC]">
              <User size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black uppercase tracking-wide truncate text-gray-300">Operator</span>
              <span className="text-[9px] font-medium text-gray-600 truncate">dev@xoeris.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500/5 hover:bg-red-500/10 hover:text-red-400 border border-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Lock Core
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
      <div className="flex-1 flex flex-col min-w-0 h-screen w-full">
        
        {/* Top Header */}
        <header className="border-b border-white/5 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-widest text-gray-400">Xalme // Console</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active status */}
            <div className="hidden sm:flex items-center gap-2 bg-[#705EBC]/10 border border-[#705EBC]/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#705EBC] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#705EBC]">Secure Link</span>
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
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-500">
                  {msg.role === 'user' ? 'Operator' : 'Xalme Core-1'}
                </div>
                <div
                  className={`px-5 py-3.5 rounded-[1.5rem] leading-relaxed text-sm font-medium border ${msg.role === 'user'
                      ? 'bg-[#705EBC]/10 border-[#705EBC]/20 text-white rounded-tr-none'
                      : msg.content.startsWith('[ERROR]')
                        ? 'bg-red-500/10 border-red-500/20 text-red-400 rounded-tl-none font-mono text-xs'
                        : 'bg-white/[0.02] border-white/5 text-gray-200 rounded-tl-none'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-wider">
                <RefreshCw size={14} className="animate-spin text-[#705EBC]" />
                {statusText || 'Syncing...'}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar Form */}
          <div className="p-6 bg-gradient-to-t from-black via-black to-transparent z-20">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto bg-[#0a0a0c] border border-white/5 rounded-3xl p-3 flex flex-col gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              {/* Action Bar Header */}
              <div className="flex items-center justify-between px-3 pt-2">
                <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Model: Xalme-1.1</span>
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
              <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3">
                <input
                  type="text"
                  placeholder="Ask a follow-up..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="flex-grow bg-transparent text-sm font-medium outline-none border-none text-white placeholder:text-gray-600 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-[#705EBC] hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 text-white p-3.5 rounded-xl flex items-center justify-center transition-all shadow-[0_10px_30px_rgba(112,94,188,0.2)]"
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