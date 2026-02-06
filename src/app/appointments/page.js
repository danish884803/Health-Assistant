'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Calendar, Clock, X, ArrowLeft } from 'lucide-react';

export default function AppointmentsPage() {
  const router = useRouter(); 
  const [appointments, setAppointments] = useState([]);
  const [reschedule, setReschedule] = useState(null);

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [slotBooked, setSlotBooked] = useState(false);

  useEffect(() => {
    fetch('/api/appointments', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setAppointments(data.appointments || []))
      .catch(() => setAppointments([]));
  }, []);

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
        {/* ✅ Fixed Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-teal-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-6 text-gray-900">My Appointments</h1>

        {appointments.length === 0 && (
          <p className="text-gray-500">No appointments found</p>
        )}

        <div className="space-y-4">
          {appointments.map(a => (
            <div key={a._id} className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-gray-900">{a.doctorName}</p>
                  <p className="text-sm text-gray-500">
                    {a.department} • {a.clinic} • Room {a.room}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  a.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-700'
                }`}>
                  {a.status}
                </span>
              </div>

              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-teal-600" />
                  {new Date(a.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-teal-600" />
                  {a.time}
                </span>
              </div>

              {a.status !== 'cancelled' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setReschedule(a);
                      setNewDate('');
                      setNewTime('');
                      setSlotBooked(false);
                    }}
                    className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(a._id)}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Reschedule Modal */}
      {reschedule && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-gray-900">Reschedule Appointment</h2>
              <button 
                onClick={() => setReschedule(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Select New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
              />

              <label className="block text-sm font-medium text-gray-700">Select New Time</label>
              <input
                type="time"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className={`w-full border rounded-lg p-2 outline-none focus:ring-2 ${
                  slotBooked ? 'border-red-500 ring-2 ring-red-100' : 'focus:ring-teal-500'
                }`}
              />
            </div>

            {slotBooked && (
              <p className="text-sm text-red-600 font-semibold flex items-center gap-1">
                ❌ This slot is already booked.
              </p>
            )}

            <button
              onClick={submitReschedule}
              disabled={!newTime || !newDate || slotBooked}
              className="w-full bg-teal-600 text-white rounded-lg py-2.5 font-semibold disabled:opacity-50 hover:bg-teal-700 transition-colors"
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