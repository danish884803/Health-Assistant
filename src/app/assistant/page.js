'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Send, Bot, Calendar, MapPin, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello 👋 I am your Hospital AI Assistant. I can help with appointments, doctors, and navigation.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(textFromButton) {
    const text = textFromButton ?? input;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();

      /* =========================
         MY APPOINTMENTS
      ========================= */
      if (data.intent === 'MY_APPOINTMENTS') {
        const r = await fetch('/api/appointments', { credentials: 'include' });
        const a = await r.json();

        if (!a.appointments || a.appointments.length === 0) {
          pushAssistant('You have no upcoming appointments.');
        } else {
          const list = a.appointments
            .map(
              ap =>
                `• ${ap.doctorName} (${ap.department}) on ${new Date(
                  ap.date
                ).toLocaleDateString()} at ${ap.time}`
            )
            .join('\n');

          pushAssistant(`📅 Your appointments:\n\n${list}`);
        }
        return;
      }

      /* =========================
         FIND DOCTOR
      ========================= */
      if (data.intent === 'FIND_DOCTOR' && data.department) {
        const r = await fetch(
          `/api/doctor?department=${encodeURIComponent(data.department)}`
        );
        const d = await r.json();

        if (!d.doctors || d.doctors.length === 0) {
          pushAssistant(`No doctors found for ${data.department}.`);
        } else {
          const list = d.doctors
            .map(doc => `• Dr. ${doc.name} — ${doc.clinic}`)
            .join('\n');

          pushAssistant(`🩺 Available doctors in ${data.department}:\n\n${list}`);
        }
        return;
      }

      /* =========================
         NAVIGATION
      ========================= */
      if (data.intent === 'NAVIGATE' && data.roomCode) {
        pushAssistant(`📍 Taking you to ${data.roomCode.replace('-', ' ')}`);
        setTimeout(() => router.push(`/map?room=${data.roomCode}`), 1200);
        return;
      }

      /* =========================
         NORMAL MESSAGE
      ========================= */
      if (data.content) {
        pushAssistant(data.content);
      }
    } catch {
      pushAssistant('Sorry, I am temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }

  function pushAssistant(content) {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6">
        <div className="bg-white border rounded-3xl shadow-sm flex flex-col h-[70vh]">

          <div className="p-5 border-b flex items-center gap-3">
            <Bot className="text-teal-600" />
            <h1 className="font-bold text-lg">Hospital AI Assistant</h1>
          </div>

          <div className="p-4 border-b flex gap-3 flex-wrap text-sm">
            <QuickBtn
              icon={Calendar}
              label="My Appointments"
              onClick={() => sendMessage('Show my appointments')}
            />
            <QuickBtn
              icon={Stethoscope}
              label="Find Cardiologist"
              onClick={() => sendMessage('Find cardiology doctor')}
            />
            <QuickBtn
              icon={MapPin}
              label="Hospital Map"
              onClick={() => router.push('/map')}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-gray-800'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-4 border-t flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about doctors, appointments, navigation..."
              className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={() => sendMessage()}
              className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function QuickBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full hover:bg-teal-50 text-gray-700"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
