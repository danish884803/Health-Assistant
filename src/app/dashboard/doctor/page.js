// 'use client';

// import { useEffect, useState } from 'react';
// import Header from '@/components/common/Header';
// import Footer from '@/components/common/Footer';
// import {
//   Calendar,
//   Search,
//   MoreVertical,
//   FileText,
//   X,
// } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// export default function DoctorDashboard() {
//   const { user, loading } = useAuth();
//   const [schedule, setSchedule] = useState([]);

//   // 🔹 Summary modal state
//   const [activeAppointment, setActiveAppointment] = useState(null);
//   const [diagnosis, setDiagnosis] = useState('');
//   const [notes, setNotes] = useState('');
//   const [prescription, setPrescription] = useState('');
//   const [followUpDate, setFollowUpDate] = useState('');

//   /* =========================
//       LOAD DOCTOR APPOINTMENTS
//   ========================= */
//   useEffect(() => {
//     if (!user || user.role !== 'doctor') return;

//     fetch('/api/doctor/appointments', { credentials: 'include' })
//       .then(res => res.json())
//       .then(data => setSchedule(data.appointments || []))
//       .catch(() => setSchedule([]));
//   }, [user]);

//   if (loading) return null;

//   const doctorName = user?.fullName || user?.name || 'Doctor';

//   /* =========================
//       SEND MEDICAL SUMMARY
//   ========================= */
//   async function submitSummary() {
//     if (!diagnosis || !notes) {
//       alert('Diagnosis and notes are required');
//       return;
//     }

//     await fetch(
//       `/api/doctor/appointments/${activeAppointment._id}/summary`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           diagnosis,
//           notes,
//           prescription,
//           followUpDate,
//         }),
//       }
//     );

//     alert('Summary sent successfully!');
//     setActiveAppointment(null);
//     setDiagnosis('');
//     setNotes('');
//     setPrescription('');
//     setFollowUpDate('');
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />

//       <main className="pt-28 pb-20">
//         <div className="max-w-7xl mx-auto px-6">

//           {/* HEADER */}
//           <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
//             <div>
//               <h1 className="text-3xl font-extrabold text-gray-900">
//                 Welcome,{' '}
//                 <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
//                   {doctorName}
//                 </span>
//               </h1>
//               <p className="text-gray-500 mt-1">
//                 Your appointments for today
//               </p>
//             </div>

//             <div className="bg-white rounded-2xl border px-6 py-4 text-center">
//               <p className="text-2xl font-bold text-teal-600">
//                 {schedule.length}
//               </p>
//               <p className="text-xs text-gray-500 font-semibold">
//                 Patients Today
//               </p>
//             </div>
//           </div>

//           {/* MAIN GRID LAYOUT */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
//             {/* LEFT — PATIENT QUEUE (Main Content) */}
//             <div className="lg:col-span-2 space-y-6">
//               <div className="bg-white rounded-3xl border p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold">Today’s Patient Queue</h3>
//                   <div className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm text-gray-500">
//                     <Search size={16} />
//                     <input
//                       className="outline-none bg-transparent"
//                       placeholder="Search patient..."
//                     />
//                   </div>
//                 </div>

//                 {schedule.length === 0 ? (
//                   <p className="text-gray-500 text-sm">No appointments scheduled</p>
//                 ) : (
//                   <div className="space-y-4">
//                     {schedule.map(slot => (
//                       <div
//                         key={slot._id}
//                         className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border-l-4 border-teal-500"
//                       >
//                         <div>
//                           <p className="font-bold text-gray-800">{slot.patientName}</p>
//                           <p className="text-xs text-gray-500 font-medium">Patient ID: {slot.patientId}</p>
//                           <p className="text-sm text-gray-500">{slot.clinic} • Room {slot.room}</p>
//                         </div>

//                         <div className="text-sm">
//                           <p className="text-gray-500">{new Date(slot.date).toLocaleDateString()}</p>
//                           <p className="font-semibold text-gray-700">{slot.time}</p>
//                         </div>

//                         <div className="flex items-center gap-3">
//                            <span className="px-4 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
//                             {slot.status || 'Scheduled'}
//                           </span>
//                           <button
//                             onClick={() => setActiveAppointment(slot)}
//                             className="w-9 h-9 rounded-lg border bg-white flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors"
//                             title="Add medical summary"
//                           >
//                             <FileText size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* RIGHT — SCHEDULE SIDEBAR */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-3xl border p-8 sticky top-28">
//                 <h3 className="text-xl font-bold mb-4 text-gray-900">My Schedule</h3>

//                 <div className="h-40 rounded-2xl border border-dashed border-teal-200 bg-teal-50/30 flex flex-col items-center justify-center text-teal-600 font-semibold gap-2">
//                   <Calendar size={36} />
//                   <span>Monthly Planner</span>
//                 </div>

//                 <div className="mt-6 space-y-3">
//                   <button className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-emerald-400 hover:opacity-90 transition-opacity shadow-sm">
//                     Configure Availability
//                   </button>
//                   <button className="w-full py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
//                     Block Leave
//                   </button>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </main>

//       {/* MEDICAL SUMMARY MODAL */}
//       {activeAppointment && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="font-bold text-xl text-gray-900">Medical Summary</h2>
//                 <p className="text-sm text-gray-500">Patient: {activeAppointment.patientName}</p>
//               </div>
//               <button 
//                 onClick={() => setActiveAppointment(null)}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-3">
//               <input
//                 className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                 placeholder="Diagnosis"
//                 value={diagnosis}
//                 onChange={e => setDiagnosis(e.target.value)}
//               />

//               <textarea
//                 className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                 rows={3}
//                 placeholder="Clinical notes"
//                 value={notes}
//                 onChange={e => setNotes(e.target.value)}
//               />

//               <textarea
//                 className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                 rows={2}
//                 placeholder="Prescription (Optional)"
//                 value={prescription}
//                 onChange={e => setPrescription(e.target.value)}
//               />

//               <div>
//                 <label className="text-xs font-bold text-gray-400 uppercase ml-1">Follow-up Date</label>
//                 <input
//                   type="date"
//                   className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                   value={followUpDate}
//                   onChange={e => setFollowUpDate(e.target.value)}
//                 />
//               </div>
//             </div>

//             <button
//               onClick={submitSummary}
//               className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 font-bold transition-colors shadow-lg shadow-teal-100"
//             >
//               Send Summary to Patient
//             </button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }
'use client';

import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  Calendar,
  Search,
  FileText,
  X,
  UserCheck,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DoctorDashboard() {
  const { user, loading } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔹 Summary modal state
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  /* =========================
      LOAD DOCTOR APPOINTMENTS
  ========================= */
  useEffect(() => {
    if (!user || user.role !== 'doctor') return;

    fetch('/api/doctor/appointments', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setSchedule(data.appointments || []))
      .catch(() => setSchedule([]));
  }, [user]);

  /* =========================
      REAL-TIME QUEUE LOGIC
  ========================= */
  const todayStr = new Date().toLocaleDateString();

  const filteredSchedule = useMemo(() => {
    return schedule.filter(slot => 
      slot.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schedule, searchQuery]);

  // Filter for ONLY today's count
  const todayAppointments = useMemo(() => {
    return schedule.filter(slot => new Date(slot.date).toLocaleDateString() === todayStr);
  }, [schedule, todayStr]);

  // Categorize Appointments for the UI
  const categories = {
    serving: filteredSchedule.filter(s => s.status === 'serving'),
    upcoming: filteredSchedule.filter(s => s.status === 'booked' || !s.status || s.status === 'Scheduled'),
    completed: filteredSchedule.filter(s => s.status === 'completed')
  };

  if (loading) return null;

  const doctorName = user?.fullName || user?.name || 'Doctor';

  /* =========================
      SEND MEDICAL SUMMARY
  ========================= */
  async function submitSummary() {
    if (!diagnosis || !notes) {
      alert('Diagnosis and notes are required');
      return;
    }

    await fetch(
      `/api/doctor/appointments/${activeAppointment._id}/summary`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          diagnosis,
          notes,
          prescription,
          followUpDate,
          status: 'completed' // Auto-set to completed on summary send
        }),
      }
    );

    // Optimistic Update: Refresh local state to move patient to completed
    setSchedule(prev => prev.map(s => s._id === activeAppointment._id ? { ...s, status: 'completed' } : s));

    alert('Summary sent and patient marked as completed!');
    setActiveAppointment(null);
    setDiagnosis('');
    setNotes('');
    setPrescription('');
    setFollowUpDate('');
  }

  // Component for the Patient Card to keep code clean
  const PatientCard = ({ slot, isServing }) => (
    <div
      key={slot._id}
      className={`flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border-l-4 transition-all ${
        isServing 
          ? "bg-teal-50 border-teal-500 shadow-md ring-1 ring-teal-200" 
          : "bg-slate-50 border-slate-300"
      }`}
    >
      <div className="flex items-center gap-4">
        {isServing && <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />}
        <div>
          <p className="font-bold text-gray-800 flex items-center gap-2">
            {slot.patientName}
            {isServing && <span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full uppercase">Now Serving</span>}
          </p>
          <p className="text-xs text-gray-500 font-medium">ID: {slot.patientId}</p>
          <p className="text-sm text-gray-500">{slot.clinic} • Room {slot.room}</p>
        </div>
      </div>

      <div className="text-sm">
        <p className="text-gray-500">{new Date(slot.date).toLocaleDateString()}</p>
        <p className="font-semibold text-gray-700">{slot.time}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className={`px-4 py-1 rounded-full text-xs font-bold ${
          slot.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {slot.status || 'Scheduled'}
        </span>
        <button
          onClick={() => setActiveAppointment(slot)}
          className="w-9 h-9 rounded-lg border bg-white flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors"
          title="Add medical summary"
        >
          <FileText size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Welcome,{' '}
                <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  {doctorName}
                </span>
              </h1>
              <p className="text-gray-500 mt-1">
                Your appointments for today ({todayStr})
              </p>
            </div>

            <div className="bg-white rounded-2xl border px-6 py-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-teal-600">
                {todayAppointments.length}
              </p>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Patients Today
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <h3 className="text-xl font-bold text-gray-800">Today’s Patient Queue</h3>
                  <div className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm text-gray-500 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
                    <Search size={16} />
                    <input
                      className="outline-none bg-transparent w-full"
                      placeholder="Search patient..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-10">
                  {/* 1. NOW SERVING */}
                  {categories.serving.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4 text-teal-600">
                        <UserCheck size={20} />
                        <h4 className="font-bold uppercase text-xs tracking-widest">Now Serving</h4>
                      </div>
                      <div className="space-y-3">
                        {categories.serving.map(slot => <PatientCard key={slot._id} slot={slot} isServing={true} />)}
                      </div>
                    </section>
                  )}

                  {/* 2. UPCOMING */}
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                      <Clock size={20} />
                      <h4 className="font-bold uppercase text-xs tracking-widest">Upcoming Appointments</h4>
                    </div>
                    {categories.upcoming.length === 0 ? (
                      <p className="text-gray-400 text-sm italic ml-7">No upcoming patients for today</p>
                    ) : (
                      <div className="space-y-3">
                        {categories.upcoming.map(slot => <PatientCard key={slot._id} slot={slot} />)}
                      </div>
                    )}
                  </section>

                  {/* 3. COMPLETED */}
                  {categories.completed.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4 text-green-600">
                        <CheckCircle2 size={20} />
                        <h4 className="font-bold uppercase text-xs tracking-widest">Completed Today</h4>
                      </div>
                      <div className="space-y-3 opacity-70">
                        {categories.completed.map(slot => <PatientCard key={slot._id} slot={slot} />)}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT — SCHEDULE SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border p-8 sticky top-28 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-900">My Schedule</h3>

                <div className="h-40 rounded-2xl border border-dashed border-teal-200 bg-teal-50/30 flex flex-col items-center justify-center text-teal-600 font-semibold gap-2">
                  <Calendar size={36} />
                  <span>Monthly Planner</span>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-emerald-400 hover:opacity-90 transition-opacity shadow-md">
                    Configure Availability
                  </button>
                  <button className="w-full py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    Block Leave
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MEDICAL SUMMARY MODAL */}
      {activeAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-xl text-gray-900">Medical Summary</h2>
                <p className="text-sm text-gray-500">Patient: {activeAppointment.patientName}</p>
              </div>
              <button 
                onClick={() => setActiveAppointment(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                placeholder="Diagnosis"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
              />
              <textarea
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                rows={3}
                placeholder="Clinical notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <textarea
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                rows={2}
                placeholder="Prescription (Optional)"
                value={prescription}
                onChange={e => setPrescription(e.target.value)}
              />
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Follow-up Date</label>
                <input
                  type="date"
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={submitSummary}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 font-bold transition-colors shadow-lg shadow-teal-100"
            >
              Send Summary & Complete
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}