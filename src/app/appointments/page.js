'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Calendar, Clock, X } from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [reschedule, setReschedule] = useState(null);

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // ✅ NEW
  const [slotBooked, setSlotBooked] = useState(false);

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
     CHECK SLOT (RESCHEDULE)
  ========================= */
  useEffect(() => {
    if (!reschedule || !newDate || !newTime) {
      setSlotBooked(false);
      return;
    }

    fetch(
      `/api/appointments/check?doctorId=${reschedule.doctorId}&date=${newDate}&time=${newTime}`
    )
      .then(res => res.json())
      .then(data => setSlotBooked(data.booked))
      .catch(() => setSlotBooked(false));
  }, [reschedule, newDate, newTime]);

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

    if (slotBooked) {
      alert('This slot is already booked');
      return;
    }

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
    setSlotBooked(false);
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
                    onClick={() => {
                      setReschedule(a);
                      setNewDate('');
                      setNewTime('');
                      setSlotBooked(false);
                    }}
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

            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className={`w-full border rounded-lg p-2 ${
                slotBooked ? 'border-red-500 ring-1 ring-red-300' : ''
              }`}
            />

            {slotBooked && (
              <p className="text-sm text-red-600 font-semibold">
                ❌ This slot is already booked. Choose another time.
              </p>
            )}

            <button
              onClick={submitReschedule}
              disabled={!newTime || slotBooked}
              className="w-full bg-teal-600 text-white rounded-lg py-2 font-semibold disabled:opacity-50"
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
