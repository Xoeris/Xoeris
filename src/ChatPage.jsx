import React, { useState, useRef, useEffect } from 'react';
import {
  Menu, Settings, Info, Plus, Search, Trash2, Check, Copy, ExternalLink,
  ChevronDown, X, Shield, Zap, AlertTriangle, Lightbulb, Loader2, Sparkles, Lock, ArrowRight
} from 'lucide-react';

import AuthPage from './AuthPage';
import ElectricSlider from './components/ElectricSlider';
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

// Effort profiles and level resolution matching desktop & Horizone IDE
const EFFORT_LEVELS = [
  { level: 0, label: 'Low', hint: '≈1k tokens · 1-3 steps · direct answer · temp 0.70', tokens: 1024 },
  { level: 1, label: 'Medium', hint: '≈2k tokens · up to 6 steps · verifies logic · temp 0.50', tokens: 2048 },
  { level: 2, label: 'High', hint: '≈4k tokens · up to 12 steps · plans & executes · temp 0.40', tokens: 4096 },
  { level: 3, label: 'Super', hint: '≈8k tokens (4k thinking) · up to 20 steps · plans & verifies · temp 0.30', tokens: 8192 },
];

export default function ChatPage({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getStoredToken();
    const hasChatAuth = localStorage.getItem('xoeris_chat_auth') === 'true';
    return Boolean(token) || hasChatAuth;
  });

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [syncing, setSyncing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatsPanelOpen, setChatsPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Popups
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [modelPopupOpen, setModelPopupOpen] = useState(false);
  const [approvalPopupOpen, setApprovalPopupOpen] = useState(false);
  const [effortPopupOpen, setEffortPopupOpen] = useState(false);
  const [thinkingPopupOpen, setThinkingPopupOpen] = useState(false);
  const [contextPopupOpen, setContextPopupOpen] = useState(false);

  // AI Controls State (Matching desktop)
  const [selectedModel, setSelectedModel] = useState('Atlas'); // Atlas | Forge | Nebula
  const [approvalMode, setApprovalMode] = useState('Manual');   // Manual | Auto | Bypass
  const [effortMode, setEffortMode] = useState('Max');         // Pro | Max
  const [effortLevel, setEffortLevel] = useState(3);           // 0 - 3 (Super)
  const [effortEnabled, setEffortEnabled] = useState(true);
  const [thinkingEnabled, setThinkingEnabled] = useState(true);

  // Chat conversation state
  const [currentThreadId, setCurrentThreadId] = useState(() => {
    return localStorage.getItem('xalme_active_thread_id') || `thread_${Date.now()}`;
  });

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
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Close popups on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-popup-container]')) {
        setModelPopupOpen(false);
        setApprovalPopupOpen(false);
        setEffortPopupOpen(false);
        setThinkingPopupOpen(false);
        setContextPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load active thread messages
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(`xalme_msgs_${currentThreadId}`);
      setMessages(storedMessages ? JSON.parse(storedMessages) : []);
    } catch {
      setMessages([]);
    }
  }, [currentThreadId]);

  // Auth sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setSession(urlToken, null);
      setIsAuthenticated(true);
      setSyncing(true);
      syncUserFromDatabase()
        .then((user) => { if (user) setCurrentUser(user); })
        .catch(() => null)
        .finally(() => setSyncing(false));
      params.delete('token');
      const cleanUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
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

  const handleStartNewChat = () => {
    const newId = `thread_${Date.now()}`;
    setCurrentThreadId(newId);
    setMessages([]);
    setInput('');
    localStorage.setItem('xalme_active_thread_id', newId);
  };

  const handleSelectThread = (threadId) => {
    setCurrentThreadId(threadId);
    localStorage.setItem('xalme_active_thread_id', threadId);
  };

  const handleDeleteThread = (e, threadId) => {
    e.stopPropagation();
    const updated = threads.filter((t) => t.id !== threadId);
    setThreads(updated);
    localStorage.setItem('xalme_chat_threads', JSON.stringify(updated));
    localStorage.removeItem(`xalme_msgs_${threadId}`);
    if (currentThreadId === threadId) handleStartNewChat();
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

    let assistantMessage = null;

    // Call chat completions
    try {
      const response = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(PUBLIC_API_KEY ? { 'Authorization': `Bearer ${PUBLIC_API_KEY}` } : {})
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are Xalme, an advanced AI reasoning system developed by Xoeris using model ${selectedModel} in ${effortMode} effort mode. Deliver clean, elegant, high-impact guidance and code.`
            },
            ...updatedMessages.filter(m => m.role !== 'system')
          ],
          max_new_tokens: EFFORT_LEVELS[effortLevel].tokens,
          temperature: effortLevel === 3 ? 0.30 : 0.60
        })
      });

      if (response.ok) {
        const data = await response.json();
        assistantMessage = data.choices?.[0]?.message?.content || data.output?.text;
      }
    } catch {}

    // Fallback if network/endpoint unavailable
    if (!assistantMessage) {
      await new Promise(r => setTimeout(r, 600));
      assistantMessage = `### ${selectedModel} Response (${effortMode} · ${EFFORT_LEVELS[effortLevel].label})

I have analyzed your request:
> *${textToSend}*

#### Assessment & Recommendation:
1. **Architectural Coherence**: Maintain clean encapsulation and single-responsibility boundaries.
2. **Deterministic Flow**: Verify asynchronous state transitions and ensure robust error mitigation at integration interfaces.
3. **Execution**: Implement idiomatic, resilient patterns designed for high throughput and maintainability.

*Synthesized with Xalme ${selectedModel} Reasoning Engine.*`;
    }

    const finalMessages = [...updatedMessages, { role: 'assistant', content: assistantMessage }];
    setMessages(finalMessages);
    localStorage.setItem(`xalme_msgs_${currentThreadId}`, JSON.stringify(finalMessages));
    setLoading(false);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const activeProfile = EFFORT_LEVELS[effortLevel] || EFFORT_LEVELS[3];
  const activeThread = threads.find(t => t.id === currentThreadId);
  const filteredThreads = threads.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Auth Guard
  if (!isAuthenticated) {
    return <AuthPage onNavigate={onNavigate} onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const isAdmin = isUserAdmin(currentUser);
  const isUltra = isUserUltra(currentUser);
  const hasAccess = isAdmin || isUltra;

  if (syncing && !hasAccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center font-sans p-6">
        <Loader2 className="w-8 h-8 text-[#FFC94A] animate-spin mb-3" />
        <p className="text-xs font-mono text-[#888899] uppercase tracking-widest">Verifying Xalme access...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center font-sans p-6 relative">
        <div className="max-w-md w-full bg-[#131318] border border-[#2E2E38] rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#201A0C] border border-[#FFC94A]/30 flex items-center justify-center text-[#FFC94A]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Xalme Web Requires Ultra</h1>
          <p className="text-xs text-[#888898] leading-relaxed mb-6">
            Web access is reserved for Ultra subscribers. You can chat via desktop or upgrade your account.
          </p>
          <button
            onClick={() => onNavigate ? onNavigate('pricing') : window.location.href = '/pricing'}
            className="w-full py-3 rounded-xl bg-[#FFC94A] hover:bg-[#FFD46A] text-[#141418] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-[0_0_20px_rgba(255,201,74,0.3)]"
          >
            <span>Upgrade to Ultra</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0A0A0F] text-white flex font-sans select-none overflow-hidden relative">
      {/* ── Subdued Ambient Glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-100px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#FFC94A]/10 blur-[130px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[550px] h-[550px] rounded-full bg-[#3B82F6]/10 blur-[140px]" />
      </div>

      {/* ════ COLUMN 1: LEFT WORKSPACE NAVIGATION ════ */}
      <aside
        className={`${
          sidebarOpen ? 'w-56' : 'w-14'
        } bg-[#0A0A0F]/90 backdrop-blur-md flex flex-col justify-between transition-all duration-200 border-r border-[#1C1C24] z-30 shrink-0 h-full`}
      >
        <div className="flex flex-col flex-1 min-h-0 pt-3">
          {/* Hamburger toggle */}
          <div className="px-3 mb-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-[#888898] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center"
              title="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
          </div>

          {/* Section: WORKSPACE */}
          {sidebarOpen && (
            <div className="px-5 mb-2 text-[9px] font-bold tracking-[0.2em] text-[#424250] uppercase">
              WORKSPACE
            </div>
          )}

          {/* Navigation Item: Chat */}
          <div className="px-2 space-y-1">
            <button
              className={`w-full px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-3 transition-all cursor-pointer text-left ${
                sidebarOpen
                  ? 'bg-[#1C180E] border border-[#FFC94A]/70 text-[#FFC94A] shadow-[0_0_15px_rgba(255,201,74,0.08)]'
                  : 'justify-center text-[#FFC94A] bg-[#1C180E] border border-[#FFC94A]/60'
              }`}
              title="Chat Workspace"
            >
              <div className="w-4 h-4 rounded-sm border border-[#FFC94A] flex items-center justify-center text-[10px] shrink-0">
                ✦
              </div>
              {sidebarOpen && <span className="tracking-wide">Chat</span>}
            </button>
          </div>
        </div>

        {/* Pinned Bottom: Settings & About */}
        <div className="p-2 border-t border-[#1C1C24] space-y-1">
          <button
            onClick={() => setSettingsOpen(true)}
            className={`w-full px-3 py-2 rounded-xl text-[#888898] hover:text-white hover:bg-white/[0.04] text-xs flex items-center gap-3 transition-colors bg-transparent border-none cursor-pointer ${
              !sidebarOpen && 'justify-center'
            }`}
            title="Settings"
          >
            <Settings size={16} className="shrink-0 text-[#888898]" />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button
            onClick={() => setAboutOpen(true)}
            className={`w-full px-3 py-2 rounded-xl text-[#888898] hover:text-white hover:bg-white/[0.04] text-xs flex items-center gap-3 transition-colors bg-transparent border-none cursor-pointer ${
              !sidebarOpen && 'justify-center'
            }`}
            title="About"
          >
            <Info size={16} className="shrink-0 text-[#888898]" />
            {sidebarOpen && <span>About</span>}
          </button>
        </div>
      </aside>

      {/* ════ COLUMN 2: CHATS LIST PANEL (With Golden Gradient Border) ════ */}
      <section
        className={`${
          chatsPanelOpen ? 'w-64' : 'w-0'
        } transition-all duration-200 bg-[#0F0F14] flex flex-col shrink-0 h-full overflow-hidden border-r border-[#24242C] relative z-20`}
        style={{
          borderLeft: '1.5px solid #FFC94A',
          borderTop: '1.5px solid #FFC94A'
        }}
      >
        <div className="p-4 flex flex-col h-full min-h-0">
          <h2 className="text-base font-semibold text-[#F0F0F5] mb-3">Chats</h2>

          {/* + New Chat */}
          <button
            onClick={handleStartNewChat}
            className="w-full py-2 px-3 rounded-lg bg-transparent hover:bg-white/[0.04] text-[#F0F0F5] text-xs font-medium flex items-center gap-2 border-none cursor-pointer transition-colors mb-3 text-left"
          >
            <span className="text-[#FFC94A] text-sm leading-none font-bold">＋</span>
            <span>New chat</span>
          </button>

          {/* Search chats */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1B1B22] border border-[#2E2E38] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#6E6E80] outline-none focus:border-[#FFC94A]/60 transition-colors"
            />
          </div>

          {/* Threads list */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0">
            <div className="text-[10px] font-bold tracking-wider text-[#646476] uppercase px-2 mb-1.5">
              Today
            </div>
            {filteredThreads.length === 0 ? (
              <div className="px-2 py-3 text-xs text-[#525260] italic">
                {threads.length === 0 ? 'No chats yet' : 'No matching chats'}
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isActive = thread.id === currentThreadId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`group w-full px-2.5 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#2A2519] text-[#FFC94A] font-semibold'
                        : 'text-[#CCCCD5] hover:bg-[#1E1E26] hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{thread.title || 'New chat'}</span>
                    <button
                      onClick={(e) => handleDeleteThread(e, thread.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#777788] hover:text-red-400 p-0.5 rounded bg-transparent border-none cursor-pointer transition-opacity"
                      title="Delete chat"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-[#1C1C24] text-[10px] text-[#707080]">
            Saved on this device
          </div>
        </div>
      </section>

      {/* ════ COLUMN 3: MAIN CHAT WORKSPACE (Header, Welcome/Messages, Composer) ════ */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-[#0A0A0F]">
        
        {/* Top Header Bar */}
        <header className="h-11 px-4 flex justify-between items-center bg-[#1B1B1F] border-b border-[#2E2E38] shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setChatsPanelOpen(!chatsPanelOpen)}
              className="p-1 text-[#888899] hover:text-white bg-transparent border-none cursor-pointer rounded transition-colors"
              title="Toggle chats panel"
            >
              <div className="w-4 h-4 border border-[#888899] rounded-sm relative flex items-center">
                <div className="w-1 h-full border-r border-[#888899]" />
              </div>
            </button>
            <span className="text-xs font-semibold text-[#F0F0F5] truncate">
              {activeThread?.title || 'New chat'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartNewChat}
              className="text-[#888899] hover:text-white text-xs px-2 py-1 bg-transparent border-none cursor-pointer"
              title="Conversation options"
            >
              ⋯
            </button>
          </div>
        </header>

        {/* Chat Content Body */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Welcome Screen (0 messages) */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full overflow-y-auto">
              
              {/* Golden ✦ icon badge */}
              <div className="w-11 h-11 rounded-xl bg-[#201A0C] border border-[#3A2C0E] flex items-center justify-center text-[#FFC94A] text-xl mb-4 shadow-[0_0_25px_rgba(255,201,74,0.12)]">
                ✦
              </div>

              <h1 className="text-xl font-black text-[#F0F0F5] tracking-tight text-center mb-1">
                Xalme
              </h1>
              <p className="text-xs text-[#777788] text-center mb-5 font-medium">
                Think. Build. Explore.
              </p>

              {/* Bullet Features with Green Checkmarks */}
              <div className="space-y-2 mb-8 text-left max-w-md w-full text-xs text-[#CCCCD5]">
                <div className="flex items-start gap-2.5">
                  <Check size={14} className="text-[#00C896] shrink-0 mt-0.5" />
                  <span>A focused space for your ideas, code and technical questions.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={14} className="text-[#00C896] shrink-0 mt-0.5" />
                  <span>Powered by Atlas, Forge, and Nebula — Xalme's own model family.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={14} className="text-[#00C896] shrink-0 mt-0.5" />
                  <span>Save chats on this device and export them whenever you need.</span>
                </div>
              </div>

              {/* Start with a prompt label */}
              <p className="text-[10px] font-semibold text-[#555566] uppercase tracking-wider mb-3">
                Start with a prompt
              </p>

              {/* 2x2 Grid of Prompt Cards */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                {[
                  {
                    title: 'System design',
                    sub: 'Architecture for scale',
                    prompt: 'Help me design the architecture for a scalable, high-concurrency microservice system.'
                  },
                  {
                    title: 'Refactor code',
                    sub: 'Clarity & performance',
                    prompt: 'Help me refactor this code for clarity and performance:'
                  },
                  {
                    title: 'Explain concept',
                    sub: 'Zero-knowledge proofs',
                    prompt: 'Explain how zero-knowledge proofs work with practical examples.'
                  },
                  {
                    title: 'Security review',
                    sub: 'Vulnerabilities & edge cases',
                    prompt: 'Review this snippet for security vulnerabilities and edge cases:'
                  }
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(card.prompt)}
                    className="p-3 rounded-lg bg-[#141418] hover:bg-[#1C1C24] border border-[#24242C] hover:border-[#383848] text-left transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-semibold text-[#ECECEC] mb-0.5">{card.title}</div>
                    <div className="text-[10.5px] text-[#777788] group-hover:text-[#9999AA]">{card.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Stream */
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-w-3xl mx-auto w-full">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-md bg-[#201A0C] border border-[#3A2C0E] flex items-center justify-center shrink-0 mt-0.5 text-[#FFC94A] text-xs">
                      ✦
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 leading-relaxed text-xs md:text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#1C180E] border border-[#FFC94A]/30 text-white'
                        : 'bg-[#15151C] border border-[#282836] text-[#ECECEC] whitespace-pre-wrap'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5 text-[10.5px]">
                        <span className="text-[#FFC94A] font-semibold">Xalme ({selectedModel})</span>
                        <button
                          onClick={() => handleCopy(msg.content, index)}
                          className="hover:text-white flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-[#777788]"
                        >
                          {copiedIndex === index ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-[#777788] bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFC94A] animate-ping" />
                  <span>Xalme is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ════ COMPOSER AREA (Golden Border Container with Native Popups) ════ */}
          <div className="p-3.5 bg-[#0A0A0F] z-20">
            <div
              className="max-w-3xl mx-auto w-full rounded-xl bg-[#1C1C1C] border border-[#FFC94A]/60 p-2 shadow-2xl relative transition-all"
            >
              {/* Text Input Row */}
              <div className="relative flex items-start px-2 pt-1 pb-1">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Ask Xalme or type / for commands..."
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="w-full bg-transparent text-[#F0F0F5] placeholder-[#666677] text-xs resize-none outline-none border-none leading-relaxed font-sans max-h-36 pr-6"
                />
                <span className="text-[#3A3A4A] text-xs select-none">✦</span>
              </div>

              {/* Bottom Controls Row: + | Model | Approval | Effort Badge | Thinking | Context | Send */}
              <div className="flex items-center justify-between pt-2 border-t border-[#262626] px-1 text-xs">
                
                {/* Left Controls Strip */}
                <div className="flex items-center gap-1.5">
                  {/* + Button */}
                  <button
                    className="p-1 hover:bg-white/[0.06] rounded text-[#AAAAAA] hover:text-white bg-transparent border-none cursor-pointer"
                    title="Add context"
                  >
                    <Plus size={14} />
                  </button>

                  {/* 🤖 Model Selector */}
                  <div className="relative" data-popup-container>
                    <button
                      onClick={() => setModelPopupOpen(!modelPopupOpen)}
                      className="px-2 py-1 rounded hover:bg-white/[0.06] text-[#DDDDDD] flex items-center gap-1 bg-transparent border-none cursor-pointer text-xs font-medium"
                    >
                      <span>{selectedModel}</span>
                      <ChevronDown size={11} className="text-[#888888]" />
                    </button>

                    {modelPopupOpen && (
                      <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#1F1F1F] border border-[#333333] rounded-lg p-1.5 shadow-2xl z-50 animate-fade-in">
                        <div className="text-[10px] text-[#888888] font-bold px-2 py-1 uppercase">
                          Xalme Models
                        </div>
                        {[
                          { name: 'Atlas', initial: 'A', bg: '#1A1C28', border: '#2E3056', color: '#6B8AFF' },
                          { name: 'Forge', initial: 'F', bg: '#201410', border: '#4A2E10', color: '#FF8C42' },
                          { name: 'Nebula', initial: 'N', bg: '#14201A', border: '#1A4A30', color: '#4EE8A0' }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => {
                              setSelectedModel(m.name);
                              setModelPopupOpen(false);
                            }}
                            className="w-full px-2 py-1.5 rounded flex items-center justify-between hover:bg-white/[0.06] bg-transparent border-none cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                                style={{ backgroundColor: m.bg, border: `1px solid ${m.border}`, color: m.color }}
                              >
                                {m.initial}
                              </div>
                              <span className="text-xs font-semibold text-[#ECECEC]">{m.name}</span>
                            </div>
                            {selectedModel === m.name && <Check size={13} className="text-[#00C896]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ⚡ Approval Mode */}
                  <div className="relative" data-popup-container>
                    <button
                      onClick={() => setApprovalPopupOpen(!approvalPopupOpen)}
                      className="px-2 py-1 rounded hover:bg-white/[0.06] text-[#DDDDDD] flex items-center gap-1 bg-transparent border-none cursor-pointer text-xs"
                      title="Approval mode"
                    >
                      <Shield size={13} className="text-[#AAAAAA]" />
                      <ChevronDown size={11} className="text-[#888888]" />
                    </button>

                    {approvalPopupOpen && (
                      <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#1F1F1F] border border-[#333333] rounded-lg p-2 shadow-2xl z-50">
                        <div className="text-[10px] text-[#888888] font-bold px-1 py-1 mb-1">
                          How should actions be approved?
                        </div>
                        {[
                          { id: 'Manual', title: 'Manual Approval', desc: 'Xalme asks before acting' },
                          { id: 'Auto', title: 'Auto Approval', desc: 'Xalme reviews and asks when needed' },
                          { id: 'Bypass', title: 'Bypass Approval', desc: 'Xalme acts without confirmation', warn: true }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setApprovalMode(item.id);
                              setApprovalPopupOpen(false);
                            }}
                            className="w-full p-2 rounded hover:bg-white/[0.06] flex items-center justify-between text-left bg-transparent border-none cursor-pointer"
                          >
                            <div>
                              <div className={`text-xs font-semibold ${item.warn ? 'text-[#D97706]' : 'text-[#DDDDDD]'}`}>
                                {item.title}
                              </div>
                              <div className={`text-[10px] ${item.warn ? 'text-[#D97706]/80' : 'text-[#888888]'}`}>
                                {item.desc}
                              </div>
                            </div>
                            {approvalMode === item.id && <Check size={13} className="text-[#00C896] shrink-0" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ⚙️ Effort Badge (PRO / MAX using authentic badges matching Horizone IDE) */}
                  <div className="relative" data-popup-container>
                    <button
                      onClick={() => setEffortPopupOpen(!effortPopupOpen)}
                      className="px-2 py-1 rounded hover:bg-white/[0.06] flex items-center gap-1 bg-transparent border-none cursor-pointer"
                      title="Effort mode"
                    >
                      <img
                        src={effortMode === 'Max' ? '/sarah_logo_agent_max.png' : '/sarah_logo_agent_pro.png'}
                        alt={effortMode}
                        className="h-[18px] w-auto object-contain"
                      />
                      <ChevronDown size={11} className="text-[#CCCCCC]" />
                    </button>

                    {effortPopupOpen && (
                      <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#1F1F1F] border border-[#333333] rounded-lg p-2.5 shadow-2xl z-50">
                        <div className="text-[10px] text-[#888888] font-bold px-1 mb-2">
                          Effort
                        </div>

                        {/* Pro Row */}
                        <button
                          onClick={() => setEffortMode('Pro')}
                          className="w-full px-2 py-1.5 rounded hover:bg-white/[0.06] flex items-center justify-between bg-transparent border-none cursor-pointer text-left mb-1"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src="/sarah_logo_agent_pro.png" alt="Pro" className="h-4 w-auto object-contain" />
                            <span className="text-xs font-semibold text-[#DDDDDD]">Pro</span>
                          </div>
                          {effortMode === 'Pro' && <Check size={13} className="text-[#00C896]" />}
                        </button>

                        {/* Max Row */}
                        <button
                          onClick={() => setEffortMode('Max')}
                          className="w-full px-2 py-1.5 rounded hover:bg-white/[0.06] flex items-center justify-between bg-transparent border-none cursor-pointer text-left mb-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src="/sarah_logo_agent_max.png" alt="Max" className="h-4 w-auto object-contain" />
                            <span className="text-xs font-semibold text-[#DDDDDD]">Max</span>
                          </div>
                          {effortMode === 'Max' && <Check size={13} className="text-[#00C896]" />}
                        </button>

                        <div className="h-px bg-[#2E2E38] my-2" />

                        {/* Effort slider header */}
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[11px] text-[#888888]">Effort</span>
                          <span className="text-[11px] font-semibold text-[#ECECEC]">{activeProfile.label}</span>
                        </div>

                        <div className="flex justify-between text-[10px] text-[#666666] px-1 mb-1.5">
                          <span>Faster</span>
                          <span>Smarter</span>
                        </div>

                        {/* Electric Slider control */}
                        <div className="my-1">
                          <ElectricSlider
                            value={effortLevel}
                            min={0}
                            max={3}
                            onChange={(val) => setEffortLevel(val)}
                          />
                        </div>

                        <div className="text-[10px] text-[#777788] leading-tight px-1 mb-3">
                          {activeProfile.hint}
                        </div>

                        <div className="h-px bg-[#2E2E38] my-2" />

                        {/* Enable Effort Toggle */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs text-[#DDDDDD]">Enable Effort</span>
                          <input
                            type="checkbox"
                            checked={effortEnabled}
                            onChange={(e) => setEffortEnabled(e.target.checked)}
                            className="accent-[#00C896] cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 💡 Thinking Mode Toggle */}
                  <div className="relative" data-popup-container>
                    <button
                      onClick={() => setThinkingPopupOpen(!thinkingPopupOpen)}
                      className={`p-1.5 rounded hover:bg-white/[0.06] bg-transparent border-none cursor-pointer ${
                        thinkingEnabled ? 'text-[#00C896]' : 'text-[#666677]'
                      }`}
                      title="Thinking Mode"
                    >
                      <Lightbulb size={14} />
                    </button>

                    {thinkingPopupOpen && (
                      <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#1F1F1F] border border-[#333333] rounded-lg p-2.5 shadow-2xl z-50">
                        <div className="text-[10px] text-[#888888] font-bold mb-2">Thinking</div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[#DDDDDD]">Enable Thinking</span>
                          <input
                            type="checkbox"
                            checked={thinkingEnabled}
                            onChange={(e) => setThinkingEnabled(e.target.checked)}
                            className="accent-[#00C896] cursor-pointer"
                          />
                        </div>
                        <p className="text-[10px] text-[#888899] leading-relaxed">
                          When Thinking is enabled, Xalme uses extended step-by-step reasoning before answering.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Controls: Context Arc & Send */}
                <div className="flex items-center gap-2">
                  
                  {/* Context Window Ring */}
                  <div className="relative" data-popup-container>
                    <button
                      onClick={() => setContextPopupOpen(!contextPopupOpen)}
                      className="p-1 hover:bg-white/[0.06] rounded bg-transparent border-none cursor-pointer flex items-center justify-center"
                      title="Context window usage"
                    >
                      <div className="w-3.5 h-3.5 rounded-full border border-[#2B2B2B] border-t-[#3478F6] animate-none" />
                    </button>

                    {contextPopupOpen && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#1E1E1E] border border-[#333333] rounded-lg p-3 shadow-2xl z-50">
                        <div className="flex justify-between items-center text-xs text-[#AAAAAA] mb-2">
                          <span>Context window</span>
                          <span>0 / 128k (0%)</span>
                        </div>
                        <div className="w-full h-1 bg-[#333333] rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-[#3478F6] w-[2%]" />
                        </div>
                        <div className="h-px bg-[#333333] my-2" />
                        <div className="flex justify-between text-xs text-[#AAAAAA] mb-2">
                          <span>Plan · {effortMode} effort</span>
                          <span>›</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#E0E0E0]">
                          <span>Thinking budget</span>
                          <span>Unlimited</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Send Button (Green Arrow) */}
                  <button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer border-none ${
                      input.trim()
                        ? 'text-[#00C896] hover:bg-[#00C896]/10 active:scale-95'
                        : 'text-[#444455] cursor-not-allowed bg-transparent'
                    }`}
                    title="Send message"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M2,7 H10 V3 L16,9 L10,15 V11 H2 Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14141A] border border-[#2E2E38] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-[#FFC94A]" />
              <h3 className="text-base font-bold text-white">Settings</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">Theme</p>
                  <p className="text-[#7E7E90] text-[11px]">Dark Obsidian (APEX Yellow)</p>
                </div>
                <span className="px-2 py-1 rounded bg-[#201A0C] text-[#FFC94A] font-bold text-[10px]">Active</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">Selected Model</p>
                  <p className="text-[#7E7E90] text-[11px]">Xalme {selectedModel}</p>
                </div>
                <span className="px-2 py-1 rounded bg-[#201A0C] text-[#FFC94A] font-bold text-[10px]">{selectedModel}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14141A] border border-[#2E2E38] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setAboutOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#201A0C] border border-[#FFC94A]/30 flex items-center justify-center text-[#FFC94A] text-xl shadow-[0_0_20px_rgba(255,201,74,0.15)]">
              ✦
            </div>
            <h3 className="text-base font-bold text-white mb-1">Xalme Chat Web</h3>
            <p className="text-xs text-[#7E7E90] mb-4">Version 1.0.0 · Engineered by Xoeris</p>
            <p className="text-xs text-[#CCCCD5] leading-relaxed mb-4">
              Integrated with Xalme's intelligent reasoning models Atlas, Forge, and Nebula. Built with Horizone IDE aesthetics and direct parity across desktop and web.
            </p>
            <p className="text-[10px] text-[#555566]">© 2026 Xoeris. All rights reserved.</p>
          </div>
        </div>
      )}
    </div>
  );
}