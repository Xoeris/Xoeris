import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Key, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ChatPage({ onNavigate }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xalme execution core active. Send query to begin.' }
  ]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('xoeris_chat_key') || '');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('xoeris_chat_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!apiKey.trim()) {
      setStatusText('API Key is required to authorize requests.');
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
          'Authorization': `Bearer ${apiKey.trim()}`
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#705EBC]/30">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('xoeris')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo" className="h-6 w-6 object-contain" />
            <span className="text-sm font-black uppercase tracking-widest text-gray-400">Xalme // Core</span>
          </div>
        </div>

        {/* API Key Box */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl max-w-xs sm:max-w-md">
          <Key size={14} className="text-gray-500" />
          <input
            type="password"
            placeholder="XOERIS_API_KEY"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-transparent text-xs outline-none border-none text-white w-28 sm:w-48 placeholder:text-gray-600"
          />
        </div>
      </header>

      {/* Main Chat Feed */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 overflow-y-auto flex flex-col gap-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 max-w-[85%] ${
              msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-500">
              {msg.role === 'user' ? 'Operator' : 'Xalme Core-1'}
            </div>
            <div
              className={`px-5 py-3.5 rounded-[1.5rem] leading-relaxed text-sm font-medium border ${
                msg.role === 'user'
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
      </main>

      {/* Input Box */}
      <footer className="border-t border-white/5 bg-black/80 backdrop-blur-md px-6 py-6 sticky bottom-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            placeholder="Input operational command..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-[#705EBC]/40 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#705EBC] hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-50 text-white p-4 rounded-2xl flex items-center justify-center transition-all shadow-[0_10px_30px_rgba(112,94,188,0.2)]"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}
