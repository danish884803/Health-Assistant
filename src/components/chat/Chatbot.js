// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MessageSquare, X, Send, Mic, Volume2 } from 'lucide-react';

// export default function Chatbot() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: Date.now(),
//       role: 'assistant',
//       content:
//         "Hello! How can I help you today? I can answer questions about hospital services, departments, and appointments.",
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);

//   const recognitionRef = useRef(null);
//   const isRecognizingRef = useRef(false);
//   const endRef = useRef(null);

//   /* =========================
//      AUTO SCROLL
//   ========================= */
//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, open]);

//   /* =========================
//      INIT SPEECH RECOGNITION
//   ========================= */
//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () => {
//       isRecognizingRef.current = true;
//       setListening(true);
//     };

//     recognition.onend = () => {
//       isRecognizingRef.current = false;
//       setListening(false);
//     };

//     recognition.onerror = () => {
//       isRecognizingRef.current = false;
//       setListening(false);
//     };

//     recognition.onresult = (event) => {
//       const text = event.results[0][0].transcript;
//       setInput(text);
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   /* =========================
//      TEXT TO SPEECH
//   ========================= */
//   function speak(text) {
//     if (!window.speechSynthesis) return;

//     const utterance = new SpeechSynthesisUtterance(text);

//     // Arabic detection
//     utterance.lang = /[\u0600-\u06FF]/.test(text)
//       ? 'ar-SA'
//       : 'en-US';

//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utterance);
//   }

//   /* =========================
//      MIC TOGGLE (FIXED)
//   ========================= */
//   function toggleListening() {
//     const recognition = recognitionRef.current;
//     if (!recognition) return;

//     if (isRecognizingRef.current) {
//       recognition.stop();
//     } else {
//       recognition.start();
//     }
//   }

//   /* =========================
//      SEND MESSAGE
//   ========================= */
//   async function sendMessage() {
//     if (!input.trim() || loading) return;

//     const userMessage = {
//       id: Date.now(),
//       role: 'user',
//       content: input.trim(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const res = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           messages: [...messages, userMessage],
//           language: /[\u0600-\u06FF]/.test(userMessage.content)
//             ? 'ar'
//             : 'en',
//         }),
//       });

//       const data = await res.json();

//       if (data?.content) {
//         const aiMessage = {
//           id: Date.now() + 1,
//           role: 'assistant',
//           content: data.content,
//         };

//         setMessages((prev) => [...prev, aiMessage]);
//         speak(aiMessage.content); // 🔊 auto speak
//       }
//     } catch {
//       const fallback = {
//         id: Date.now() + 2,
//         role: 'assistant',
//         content:
//           "Sorry, I'm currently unavailable. Please contact hospital reception.",
//       };
//       setMessages((prev) => [...prev, fallback]);
//       speak(fallback.content);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       {/* Floating Button */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <button
//           onClick={() => setOpen(!open)}
//           className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-xl"
//         >
//           {open ? <X /> : <MessageSquare />}
//         </button>
//       </div>

//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.96 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 20, scale: 0.96 }}
//             className="fixed bottom-24 right-6 w-[380px] max-h-[560px] bg-white rounded-[26px] shadow-2xl z-50 flex flex-col overflow-hidden"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-teal-500 to-cyan-400 px-5 py-4 text-white font-semibold">
//               Hospital Assistant
//             </div>

//             {/* Messages */}
//             <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto bg-[#f6f9fb]">
//               {messages.map((m) => (
//                 <div
//                   key={m.id}
//                   className={`flex ${
//                     m.role === 'user' ? 'justify-end' : 'justify-start'
//                   }`}
//                 >
//                   <div className="flex items-end gap-2 max-w-[75%]">
//                     <div
//                       className={`px-4 py-3 rounded-2xl text-sm ${
//                         m.role === 'user'
//                           ? 'bg-teal-600 text-white'
//                           : 'bg-white text-gray-800 shadow'
//                       }`}
//                     >
//                       {m.content}
//                     </div>

//                     {/* 🔊 SPEAKER BUTTON */}
//                     {m.role === 'assistant' && (
//                       <button
//                         onClick={() => speak(m.content)}
//                         className="text-gray-400 hover:text-teal-600"
//                         title="Listen"
//                       >
//                         <Volume2 size={14} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <div ref={endRef} />
//             </div>

//             {/* Input */}
//             <div className="p-4 bg-white border-t">
//               <div className="flex gap-2">
//                 <button
//                   onClick={toggleListening}
//                   className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                     listening ? 'bg-red-500' : 'bg-teal-500'
//                   } text-white`}
//                 >
//                   <Mic size={16} />
//                 </button>

//                 <input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                   placeholder="Ask by typing or speaking..."
//                   className="flex-1 px-4 py-2 rounded-full border focus:ring-2 focus:ring-teal-400"
//                 />

//                 <button
//                   onClick={sendMessage}
//                   className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center"
//                 >
//                   <Send size={16} />
//                 </button>
//               </div>

//               <p className="text-[11px] text-center text-gray-400 mt-2">
//                 Voice & chat supported • No medical advice
//               </p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, Volume2, Calendar, Stethoscope, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 'init',
      role: 'assistant',
      content: "Hello! 👋 I am your Hospital AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  /* =========================
      SPEECH & VOICE LOGIC
  ========================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => { isRecognizingRef.current = true; setListening(true); };
    recognition.onend = () => { isRecognizingRef.current = false; setListening(false); };
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
    recognitionRef.current = recognition;
  }, []);

  function speak(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[\u0600-\u06FF]/.test(text) ? 'ar-SA' : 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening() {
    if (!recognitionRef.current) return;
    isRecognizingRef.current ? recognitionRef.current.stop() : recognitionRef.current.start();
  }

  /* =========================
      CORE LOGIC (INTEGRATED)
  ========================= */
  async function sendMessage(textFromButton) {
    const text = textFromButton ?? input;
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [...messages, userMsg],
            language: /[\u0600-\u06FF]/.test(userMsg.content) ? 'ar' : 'en' 
        }),
      });

      const data = await res.json();

      // 1. Handle Appointment Intent
      if (data.intent === 'MY_APPOINTMENTS') {
        const r = await fetch('/api/appointments', { credentials: 'include' });
        const a = await r.json();
        if (!a.appointments || a.appointments.length === 0) {
          pushAssistant('You have no upcoming appointments.');
        } else {
          const list = a.appointments.map(ap => `• ${ap.doctorName} (${ap.department}) on ${new Date(ap.date).toLocaleDateString()} at ${ap.time}`).join('\n');
          pushAssistant(`📅 Your appointments:\n\n${list}`);
        }
        return;
      }

      // 2. Handle Doctor Intent
      if (data.intent === 'FIND_DOCTOR' && data.department) {
        const r = await fetch(`/api/doctor?department=${encodeURIComponent(data.department)}`);
        const d = await r.json();
        if (!d.doctors || d.doctors.length === 0) {
          pushAssistant(`No doctors found for ${data.department}.`);
        } else {
          const list = d.doctors.map(doc => `• Dr. ${doc.name} — ${doc.clinic}`).join('\n');
          pushAssistant(`🩺 Available doctors in ${data.department}:\n\n${list}`);
        }
        return;
      }

      // 3. Handle Navigation Intent
      if (data.intent === 'NAVIGATE' && data.roomCode) {
        pushAssistant(`📍 Taking you to ${data.roomCode.replace('-', ' ')}`);
        setTimeout(() => router.push(`/map?room=${data.roomCode}`), 1200);
        return;
      }

      // 4. Fallback to normal AI response
      if (data.content) {
        pushAssistant(data.content);
      }

    } catch {
      pushAssistant("Sorry, I'm currently unavailable. Please contact hospital reception.");
    } finally {
      setLoading(false);
    }
  }

  function pushAssistant(content) {
    const aiMsg = { id: Date.now() + 1, role: 'assistant', content };
    setMessages(prev => [...prev, aiMsg]);
    speak(content);
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setOpen(!open)} className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-xl">
          {open ? <X /> : <MessageSquare />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-6 w-[380px] max-h-[560px] bg-white rounded-[26px] shadow-2xl z-50 flex flex-col overflow-hidden">
            
            <div className="bg-gradient-to-r from-teal-500 to-cyan-400 px-5 py-4 text-white font-semibold flex justify-between items-center">
              <span>Hospital Assistant</span>
              <button onClick={() => setOpen(false)}><X size={18}/></button>
            </div>

            <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto bg-[#f6f9fb]">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-end gap-2 max-w-[85%]">
                    <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${m.role === 'user' ? 'bg-teal-600 text-white' : 'bg-white text-gray-800 shadow'}`}>
                      {m.content}
                      {/* Special Quick Action Buttons for the first message */}
                      {m.id === 'init' && (
                        <div className="mt-3 pt-3 border-t flex flex-col gap-2">
                            <button onClick={() => sendMessage('Show my appointments')} className="flex items-center gap-2 text-[12px] bg-slate-50 p-2 rounded-lg hover:bg-teal-50 transition-colors">
                                <Calendar size={14} className="text-teal-600"/> My Appointments
                            </button>
                            {/* <button onClick={() => sendMessage('Find cardiology doctor')} className="flex items-center gap-2 text-[12px] bg-slate-50 p-2 rounded-lg hover:bg-teal-50 transition-colors">
                                <Stethoscope size={14} className="text-teal-600"/> Find Cardiologist
                            </button> */}
                            <button onClick={() => router.push('/map')} className="flex items-center gap-2 text-[12px] bg-slate-50 p-2 rounded-lg hover:bg-teal-50 transition-colors">
                                <MapPin size={14} className="text-teal-600"/> Hospital Map
                            </button>
                        </div>
                      )}
                    </div>
                    {m.role === 'assistant' && (
                      <button onClick={() => speak(m.content)} className="text-gray-400 hover:text-teal-600 mb-2"><Volume2 size={14} /></button>
                    )}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-gray-400 animate-pulse">Assistant is thinking...</div>}
              <div ref={endRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <button onClick={toggleListening} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${listening ? 'bg-red-500' : 'bg-teal-500'} text-white shadow-sm`}>
                  <Mic size={16} />
                </button>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask by typing or speaking..."
                  className="flex-1 px-4 py-2 rounded-full border border-slate-200 focus:ring-2 focus:ring-teal-400 outline-none text-sm" />
                <button onClick={() => sendMessage()} disabled={loading} className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center disabled:opacity-50">
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-2">Voice & Chat Supported • AI Assistant</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}