// 'use client';

// import { useEffect, useState } from 'react';
// import Header from '@/components/common/Header';
// import Footer from '@/components/common/Footer';
// import { Calendar, Clock, X } from 'lucide-react';

// export default function AppointmentsPage() {
//   const [appointments, setAppointments] = useState([]);
//   const [reschedule, setReschedule] = useState(null);
//   const [slots, setSlots] = useState([]);
//   const [newDate, setNewDate] = useState('');
//   const [newTime, setNewTime] = useState('');

//   /* =========================
//      LOAD APPOINTMENTS
//   ========================= */
//   useEffect(() => {
//     fetch('/api/appointments', { credentials: 'include' })
//       .then(res => res.json())
//       .then(data => setAppointments(data.appointments || []))
//       .catch(() => setAppointments([]));
//   }, []);

//   /* =========================
//      LOAD SLOTS (RESCHEDULE)
//   ========================= */
//   useEffect(() => {
//     if (!reschedule || !newDate) {
//       setSlots([]);
//       setNewTime('');
//       return;
//     }

//     fetch(
//       `/api/doctor/${reschedule.doctorId}/slots?date=${encodeURIComponent(newDate)}`
//     )
//       .then(res => res.json())
//       .then(data => setSlots(data.slots || []))
//       .catch(() => setSlots([]));
//   }, [reschedule, newDate]);

//   /* =========================
//      CANCEL APPOINTMENT
//   ========================= */
//   async function handleCancel(id) {
//     await fetch(`/api/appointments/${id}`, {
//       method: 'DELETE',
//       credentials: 'include',
//     });

//     setAppointments(prev =>
//       prev.map(a =>
//         a._id === id ? { ...a, status: 'cancelled' } : a
//       )
//     );
//   }

//   /* =========================
//      RESCHEDULE APPOINTMENT
//   ========================= */
//   async function submitReschedule() {
//     if (!newDate || !newTime) {
//       alert('Please select both date and time');
//       return;
//     }

//     const res = await fetch(`/api/appointments/${reschedule._id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({
//         date: newDate,
//         time: newTime,
//       }),
//     });

//     if (!res.ok) {
//       alert('Failed to reschedule appointment');
//       return;
//     }

//     setAppointments(prev =>
//       prev.map(a =>
//         a._id === reschedule._id
//           ? {
//               ...a,
//               date: newDate,
//               time: newTime,
//               status: 'rescheduled',
//             }
//           : a
//       )
//     );

//     setReschedule(null);
//     setNewDate('');
//     setNewTime('');
//     setSlots([]);
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />

//       <main className="pt-28 pb-20 max-w-4xl mx-auto px-6">
//         <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

//         {appointments.length === 0 && (
//           <p className="text-gray-500">No appointments found</p>
//         )}

//         <div className="space-y-4">
//           {appointments.map(a => (
//             <div
//               key={a._id}
//               className="bg-white border rounded-2xl p-6 space-y-4"
//             >
//               <div className="flex justify-between flex-wrap gap-4">
//                 <div>
//                   <p className="font-bold">{a.doctorName}</p>
//                   <p className="text-sm text-gray-500">
//                     {a.department} • {a.clinic} • Room {a.room}
//                   </p>
//                 </div>

//                 <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100">
//                   {a.status}
//                 </span>
//               </div>

//               <div className="flex gap-4 text-sm text-gray-500">
//                 <span className="flex items-center gap-2">
//                   <Calendar size={14} />
//                   {new Date(a.date).toLocaleDateString()}
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <Clock size={14} />
//                   {a.time}
//                 </span>
//               </div>

//               {a.status !== 'cancelled' && (
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => {
//                       setReschedule(a);
//                       setNewDate(a.date.slice(0, 10)); // yyyy-mm-dd
//                       setNewTime(a.time);
//                     }}
//                     className="px-4 py-2 rounded-lg border text-sm"
//                   >
//                     Reschedule
//                   </button>

//                   <button
//                     onClick={() => handleCancel(a._id)}
//                     className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* =========================
//          RESCHEDULE MODAL
//       ========================= */}
//       {reschedule && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="font-bold text-lg">Reschedule Appointment</h2>
//               <button onClick={() => setReschedule(null)}>
//                 <X />
//               </button>
//             </div>

//             <input
//               type="date"
//               value={newDate}
//               onChange={e => {
//                 setNewDate(e.target.value);
//                 setNewTime('');
//               }}
//               className="w-full border rounded-lg p-2"
//             />

//             {slots.length > 0 && (
//               <div className="grid grid-cols-3 gap-3">
//                 {slots.map(slot => (
//                   <button
//                     key={slot}
//                     onClick={() => setNewTime(slot)}
//                     className={`py-2 rounded-lg border text-sm
//                       ${
//                         newTime === slot
//                           ? 'bg-teal-600 text-white'
//                           : 'hover:bg-slate-100'
//                       }
//                     `}
//                   >
//                     {slot}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {newDate && slots.length === 0 && (
//               <p className="text-sm text-red-500">
//                 No available slots for selected date
//               </p>
//             )}

//             <button
//               onClick={submitReschedule}
//               disabled={!newTime}
//               className="w-full bg-teal-600 text-white rounded-lg py-2 font-semibold disabled:opacity-50"
//             >
//               Confirm Reschedule
//             </button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Calendar, Clock, X } from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [reschedule, setReschedule] = useState(null);
  const [slots, setSlots] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  /* =========================
     LOAD APPOINTMENTS
  ========================= */
  useEffect(() => {
    fetch('/api/appointments', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setAppointments(data.appointments || []))
      .catch(() => setAppointments([]));
  }, []);

  /* =========================
     LOAD SLOTS FOR RESCHEDULE
  ========================= */
  useEffect(() => {
    if (!reschedule || !newDate) {
      setSlots([]);
      setNewTime('');
      return;
    }

    fetch(
      `/api/doctor/${reschedule.doctorId}/slots?date=${encodeURIComponent(newDate)}`
    )
      .then(res => res.json())
      .then(data => setSlots(data.slots || []))
      .catch(() => setSlots([]));
  }, [reschedule, newDate]);

  /* =========================
     CANCEL APPOINTMENT
  ========================= */
  async function handleCancel(id) {
    await fetch(`/api/appointments/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    setAppointments(prev =>
      prev.map(a =>
        a._id === id ? { ...a, status: 'cancelled' } : a
      )
    );
  }

  /* =========================
     RESCHEDULE APPOINTMENT
  ========================= */
  async function submitReschedule() {
    if (!newDate || !newTime) return;

    await fetch(`/api/appointments/${reschedule._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ date: newDate, time: newTime }),
    });

    setAppointments(prev =>
      prev.map(a =>
        a._id === reschedule._id
          ? { ...a, date: newDate, time: newTime, status: 'rescheduled' }
          : a
      )
    );

    setReschedule(null);
    setNewDate('');
    setNewTime('');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

        {appointments.length === 0 && (
          <p className="text-gray-500">No appointments found</p>
        )}

        <div className="space-y-4">
          {appointments.map(a => (
            <div key={a._id} className="bg-white border rounded-2xl p-6 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">{a.doctorName}</p>
                  <p className="text-sm text-gray-500">
                    {a.department} • {a.clinic} • Room {a.room}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100">
                  {a.status}
                </span>
              </div>

              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(a.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {a.time}
                </span>
              </div>

              {a.status !== 'cancelled' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setReschedule(a)}
                    className="px-4 py-2 rounded-lg border text-sm"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(a._id)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* =========================
         RESCHEDULE MODAL
      ========================= */}
      {reschedule && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between">
              <h2 className="font-bold text-lg">Reschedule Appointment</h2>
              <button onClick={() => setReschedule(null)}>
                <X />
              </button>
            </div>

            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            {slots.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setNewTime(slot)}
                    className={`py-2 rounded-lg border text-sm ${
                      newTime === slot
                        ? 'bg-teal-600 text-white'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={submitReschedule}
              disabled={!newTime}
              className="w-full bg-teal-600 text-white rounded-lg py-2 font-semibold"
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
