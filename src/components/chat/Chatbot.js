'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, Volume2 } from 'lucide-react';

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
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const endRef = useRef(null);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  /* =========================
     INIT SPEECH RECOGNITION
  ========================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
    };

    recognition.onerror = () => {
      isRecognizingRef.current = false;
      setListening(false);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };

    recognitionRef.current = recognition;
  }, []);

  /* =========================
     TEXT TO SPEECH
  ========================= */
  function speak(text) {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Arabic detection
    utterance.lang = /[\u0600-\u06FF]/.test(text)
      ? 'ar-SA'
      : 'en-US';

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  /* =========================
     MIC TOGGLE (FIXED)
  ========================= */
  function toggleListening() {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecognizingRef.current) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }

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
          language: /[\u0600-\u06FF]/.test(userMessage.content)
            ? 'ar'
            : 'en',
        }),
      });

      const data = await res.json();

      if (data?.content) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.content,
        };

        setMessages((prev) => [...prev, aiMessage]);
        speak(aiMessage.content); // 🔊 auto speak
      }
    } catch {
      const fallback = {
        id: Date.now() + 2,
        role: 'assistant',
        content:
          "Sorry, I'm currently unavailable. Please contact hospital reception.",
      };
      setMessages((prev) => [...prev, fallback]);
      speak(fallback.content);
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
          className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-xl"
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
            <div className="bg-gradient-to-r from-teal-500 to-cyan-400 px-5 py-4 text-white font-semibold">
              Hospital Assistant
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
                  <div className="flex items-end gap-2 max-w-[75%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${
                        m.role === 'user'
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-gray-800 shadow'
                      }`}
                    >
                      {m.content}
                    </div>

                    {/* 🔊 SPEAKER BUTTON */}
                    {m.role === 'assistant' && (
                      <button
                        onClick={() => speak(m.content)}
                        className="text-gray-400 hover:text-teal-600"
                        title="Listen"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <button
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    listening ? 'bg-red-500' : 'bg-teal-500'
                  } text-white`}
                >
                  <Mic size={16} />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask by typing or speaking..."
                  className="flex-1 px-4 py-2 rounded-full border focus:ring-2 focus:ring-teal-400"
                />

                <button
                  onClick={sendMessage}
                  className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>

              <p className="text-[11px] text-center text-gray-400 mt-2">
                Voice & chat supported • No medical advice
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
