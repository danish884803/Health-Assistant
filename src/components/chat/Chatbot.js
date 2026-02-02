'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: 'assistant',
      content:
        "Hello! How can I help you today? I can answer questions about hospital services, departments, and appointments.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  /* =========================
     SEND MESSAGE
  ========================= */
  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language: 'en', // later auto-detect
        }),
      });

      const data = await res.json();

      if (data?.content) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: data.content,
          },
        ]);
      } else {
        throw new Error('Empty AI response');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content:
            "Sorry, I'm currently unavailable. Please contact hospital reception.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-xl hover:scale-105 transition"
        >
          {open ? <X /> : <MessageSquare />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-6 w-[380px] max-h-[560px] bg-white rounded-[26px] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-400 px-5 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  🤖
                </div>
                <div>
                  <p className="font-semibold leading-tight">
                    Hospital Assistant
                  </p>
                  <p className="text-xs opacity-90">
                    {loading ? 'Typing…' : 'Online'}
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto bg-[#f6f9fb]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-teal-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 shadow rounded-bl-md'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about our services..."
                  className="w-full pl-5 pr-14 py-3 text-sm rounded-full border shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex items-center justify-center shadow disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>

              <p className="text-[11px] text-center text-gray-400 mt-2">
                This chatbot provides hospital information only.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
