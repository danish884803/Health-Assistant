// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import Header from '@/components/common/Header';
// import Footer from '@/components/common/Footer';
// import { Send, Bot, Calendar, MapPin, Mic, Volume2, Loader2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function AssistantPage() {
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: 'Hello 👋 I am your Hospital AI Assistant. I can help with appointments, doctors, and navigation.',
//     },
//   ]);

//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);
  
//   const endRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const isStartedRef = useRef(false); 
//   const router = useRouter();

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setListening(true);
//       isStartedRef.current = true;
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       if (transcript) {
//         setInput(transcript);
//         setTimeout(() => sendMessage(transcript), 500);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech Error Type:", event.error);
      
//       isStartedRef.current = false;
//       setListening(false);
      
//       try {
//         recognition.stop();
//       } catch (e) {
//       }
//     };

//     recognition.onend = () => {
//       setListening(false);
//       isStartedRef.current = false;
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   function toggleListening() {
//     if (!recognitionRef.current) return;

//     if (isStartedRef.current) {
//       recognitionRef.current.stop();
//       setListening(false);
//       isStartedRef.current = false;
//     } else {
//       try {
//         window.speechSynthesis.cancel(); 
//         setInput('');
        
//         recognitionRef.current.start();
//       } catch (e) {
//         recognitionRef.current.stop();
//         isStartedRef.current = false;
//         setListening(false);
//         console.log("Mic busy, resetting...");
//       }
//     }
//   }
//   /* =========================
//       TEXT TO SPEECH (MANUAL ONLY)
//   ========================= */
//   function speak(text) {
//     if (!window.speechSynthesis) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = /[\u0600-\u06FF]/.test(text) ? 'ar-SA' : 'en-US';
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utterance);
//   }

//   /* =========================
//       CHAT LOGIC
//   ========================= */
//   async function sendMessage(textFromInput) {
//     const text = textFromInput ?? input;
//     if (!text || !text.trim() || loading) return;

//     if (isStartedRef.current) {
//       recognitionRef.current?.stop();
//     }

//     const userMsg = { role: 'user', content: text };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setLoading(true);

//     try {
//       const res = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//             messages: [...messages, userMsg],
//             language: /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en'
//         }),
//       });

//       const data = await res.json();

//       if (data.intent === 'MY_APPOINTMENTS') {
//         const r = await fetch('/api/appointments', { credentials: 'include' });
//         const a = await r.json();
//         if (!a.appointments || a.appointments.length === 0) {
//           pushAssistant('You have no upcoming appointments.');
//         } else {
//           const list = a.appointments.map(ap => `• ${ap.doctorName} (${ap.department}) on ${new Date(ap.date).toLocaleDateString()} at ${ap.time}`).join('\n');
//           pushAssistant(`📅 Your appointments:\n\n${list}`);
//         }
//         return;
//       }

//       if (data.intent === 'FIND_DOCTOR' && data.department) {
//         const r = await fetch(`/api/doctor?department=${encodeURIComponent(data.department)}`);
//         const d = await r.json();
//         if (!d.doctors || d.doctors.length === 0) {
//           pushAssistant(`No doctors found for ${data.department}.`);
//         } else {
//           const list = d.doctors.map(doc => `• Dr. ${doc.name} — ${doc.clinic}`).join('\n');
//           pushAssistant(`🩺 Available doctors in ${data.department}:\n\n${list}`);
//         }
//         return;
//       }

//       if (data.intent === 'NAVIGATE' && data.roomCode) {
//         pushAssistant(`📍 Taking you to ${data.roomCode.replace('-', ' ')}`);
//         setTimeout(() => router.push(`/map?room=${data.roomCode}`), 1200);
//         return;
//       }

//       if (data.content) {
//         pushAssistant(data.content);
//       }
//     } catch {
//       pushAssistant('Sorry, I am temporarily unavailable.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   function pushAssistant(content) {
//     setMessages(prev => [...prev, { role: 'assistant', content }]);
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />

//       <main className="pt-28 pb-20 max-w-4xl mx-auto px-6">
//         <div className="bg-white border rounded-3xl shadow-sm flex flex-col h-[75vh] overflow-hidden">
          
//           <div className="p-5 border-b flex items-center justify-between bg-white">
//             <div className="flex items-center gap-3">
//                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
//                  <Bot className="text-teal-600" size={20} />
//                </div>
//                <div>
//                  <h1 className="font-bold text-gray-900">Hospital AI Assistant</h1>
//                  <p className="text-[10px] text-teal-600 font-medium flex items-center gap-1 uppercase tracking-wider">
//                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" /> Online
//                  </p>
//                </div>
//             </div>
//           </div>

//           <div className="p-4 border-b bg-slate-50/50 flex gap-3 flex-wrap text-sm">
//             <QuickBtn
//               icon={Calendar}
//               label="My Appointments"
//               onClick={() => sendMessage('Show my appointments')}
//             />
//             <QuickBtn
//               icon={MapPin}
//               label="Hospital Map"
//               onClick={() => router.push('/map')}
//             />
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
//             {messages.map((m, i) => (
//               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`flex items-start gap-2 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
//                   <div
//                     className={`px-4 py-3 rounded-2xl text-sm shadow-sm whitespace-pre-line ${
//                       m.role === 'user'
//                         ? 'bg-teal-600 text-white rounded-tr-none'
//                         : 'bg-white text-gray-800 rounded-tl-none border border-slate-100'
//                     }`}
//                   >
//                     {m.content}
//                   </div>
//                   {m.role === 'assistant' && (
//                     <button 
//                       onClick={() => speak(m.content)}
//                       className="mt-2 p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all active:scale-95"
//                       title="Read aloud"
//                     >
//                       <Volume2 size={16} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="flex items-center gap-2 text-xs text-slate-400 italic">
//                 <Loader2 size={14} className="animate-spin" />
//                 Assistant is thinking...
//               </div>
//             )}
//             <div ref={endRef} />
//           </div>

//           <div className="p-4 border-t bg-white">
//             <div className="flex gap-3 items-center max-w-3xl mx-auto">
//               <button
//                 onClick={toggleListening}
//                 className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
//                   listening 
//                   ? 'bg-red-500 animate-pulse text-white' 
//                   : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600'
//                 }`}
//               >
//                 <Mic size={20} />
//               </button>

//               <div className="relative flex-1">
//                 <input
//                   value={input}
//                   onChange={e => setInput(e.target.value)}
//                   onKeyDown={e => e.key === 'Enter' && sendMessage()}
//                   placeholder={listening ? "Listening..." : "Type or speak to the assistant..."}
//                   className="w-full border border-slate-200 rounded-full px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all pr-12 text-sm"
//                 />
//                 <button
//                   onClick={() => sendMessage()}
//                   disabled={!input.trim() || loading}
//                   className="absolute right-2 top-1.5 w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center disabled:opacity-30 transition-all hover:bg-teal-700 shadow-sm"
//                 >
//                   <Send size={16} />
//                 </button>
//               </div>
//             </div>
//             <p className="text-[10px] text-center text-slate-400 mt-3">
//               Press Mic to Speak • Click Speaker icon to hear response
//             </p>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// function QuickBtn({ icon: Icon, label, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full hover:border-teal-300 hover:bg-teal-50 text-gray-700 text-xs font-medium transition-all shadow-sm"
//     >
//       <Icon size={14} className="text-teal-600" />
//       {label}
//     </button>
//   );
// }
'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  Send,
  Bot,
  Calendar,
  MapPin,
  Mic,
  Volume2,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello 👋 I am your Hospital AI Assistant. I can help with appointments, doctors, and navigation.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const isStartedRef = useRef(false);
  const router = useRouter();

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* =========================
      SPEECH RECOGNITION
  ========================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      isStartedRef.current = true;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInput(transcript);
        setTimeout(() => sendMessage(transcript), 500);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setListening(false);
      isStartedRef.current = false;
    };

    recognition.onend = () => {
      setListening(false);
      isStartedRef.current = false;
    };

    recognitionRef.current = recognition;
    return () => recognitionRef.current?.stop();
  }, []);

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (isStartedRef.current) {
      recognitionRef.current.stop();
    } else {
      try {
        window.speechSynthesis.cancel();
        setInput('');
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  }

  /* =========================
      TEXT TO SPEECH
  ========================= */
  function speak(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // Detect Arabic characters for correct voice synthesis
    utterance.lang = /[\u0600-\u06FF]/.test(text) ? 'ar-SA' : 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  /* =========================
      CHAT LOGIC
  ========================= */
  async function sendMessage(textFromInput) {
    const text = textFromInput ?? input;
    if (!text || !text.trim() || loading) return;

    if (isStartedRef.current) recognitionRef.current?.stop();

    // ✅ Logic for Navigation Confirmation (Yes/Open Map)
    if (
      pendingNavigation &&
      /^(yes|open map|show map|ok|okay|نعم|افتح الخريطة)$/i.test(text.trim())
    ) {
      pushAssistant('Opening the hospital map 🗺️');
      router.push(`/map?room=${pendingNavigation.roomCode}`);
      setPendingNavigation(null);
      setInput('');
      return;
    }

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          language: /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en'
        }),
      });

      const data = await res.json();

      // 1. NAVIGATION with Step-by-Step Logic
      if (data.intent === 'NAVIGATE' && data.steps?.length) {
        const steps = data.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
        pushAssistant(`📍 Directions to ${data.roomCode?.replace('-', ' ') || 'your destination'}:\n\n${steps}`);
        pushAssistant('🗺️ Would you like me to open the hospital map?');
        setPendingNavigation({ roomCode: data.roomCode });
        return;
      } 
      // Fallback for simple navigation
      else if (data.intent === 'NAVIGATE' && data.roomCode) {
        pushAssistant(`📍 Taking you to ${data.roomCode.replace('-', ' ')}`);
        setTimeout(() => router.push(`/map?room=${data.roomCode}`), 1200);
        return;
      }

      // 2. APPOINTMENTS
      if (data.intent === 'MY_APPOINTMENTS') {
        const r = await fetch('/api/appointments', { credentials: 'include' });
        const a = await r.json();
        if (!a.appointments?.length) {
          pushAssistant('You have no upcoming appointments.');
        } else {
          const list = a.appointments.map(ap => `• ${ap.doctorName} (${ap.department}) on ${new Date(ap.date).toLocaleDateString()} at ${ap.time}`).join('\n');
          pushAssistant(`📅 Your appointments:\n\n${list}`);
        }
        return;
      }

      // 3. FIND DOCTOR
      if (data.intent === 'FIND_DOCTOR' && data.department) {
        const r = await fetch(`/api/doctor?department=${encodeURIComponent(data.department)}`);
        const d = await r.json();
        if (!d.doctors?.length) {
          pushAssistant(`No doctors found for ${data.department}.`);
        } else {
          const list = d.doctors.map(doc => `• Dr. ${doc.name} — ${doc.clinic}`).join('\n');
          pushAssistant(`🩺 Available doctors in ${data.department}:\n\n${list}`);
        }
        return;
      }

      if (data.content) pushAssistant(data.content);
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
        <div className="bg-white border rounded-3xl shadow-sm flex flex-col h-[75vh] overflow-hidden">
          
          {/* Header Section */}
          <div className="p-5 border-b flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                 <Bot className="text-teal-600" size={20} />
               </div>
               <div>
                 <h1 className="font-bold text-gray-900">Hospital AI Assistant</h1>
                 <p className="text-[10px] text-teal-600 font-medium flex items-center gap-1 uppercase tracking-wider">
                   <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" /> Online
                 </p>
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b bg-slate-50/50 flex gap-3 flex-wrap text-sm">
            <QuickBtn
              icon={Calendar}
              label="My Appointments"
              onClick={() => sendMessage('Show my appointments')}
            />
            <QuickBtn
              icon={MapPin}
              label="Hospital Map"
              onClick={() => router.push('/map')}
            />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm shadow-sm whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-teal-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none border border-slate-100'
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === 'assistant' && (
                    <button 
                      onClick={() => speak(m.content)}
                      className="mt-2 p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all active:scale-95"
                      title="Read aloud"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <Loader2 size={14} className="animate-spin" />
                Assistant is thinking...
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-3 items-center max-w-3xl mx-auto">
              <button
                onClick={toggleListening}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                  listening 
                  ? 'bg-red-500 animate-pulse text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <Mic size={20} />
              </button>

              <div className="relative flex-1">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={listening ? "Listening..." : "Type or speak to the assistant..."}
                  className="w-full border border-slate-200 rounded-full px-5 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all pr-12 text-sm"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1.5 w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center disabled:opacity-30 transition-all hover:bg-teal-700 shadow-sm"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3">
              Press Mic to Speak • Click Speaker icon to hear response
            </p>
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
      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full hover:border-teal-300 hover:bg-teal-50 text-gray-700 text-xs font-medium transition-all shadow-sm"
    >
      <Icon size={14} className="text-teal-600" />
      {label}
    </button>
  );
}