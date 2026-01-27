'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  Calendar,
  Search,
  ExternalLink,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DoctorDashboard() {
  const { user, loading } = useAuth();
  const [schedule, setSchedule] = useState([]);

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

  if (loading) return null;

  /* =========================
     DOCTOR NAME (SAFE)
  ========================= */
  const doctorName =
    user?.name || user?.fullName || 'Doctor';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* ================= HEADER ================= */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Welcome,{' '}
                <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  {doctorName}
                </span>
              </h1>
              <p className="text-gray-500 mt-1">
                Your appointments for today
              </p>
            </div>

            <div className="bg-white rounded-2xl border px-6 py-4 text-center">
              <p className="text-2xl font-bold text-teal-600">
                {schedule.length}
              </p>
              <p className="text-xs text-gray-500 font-semibold">
                Patients Today
              </p>
            </div>
          </div>

          {/* ================= GRID ================= */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT — PATIENT QUEUE */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border p-8">

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">
                    Today’s Patient Queue
                  </h3>

                  <div className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm">
                    <Search size={16} />
                    <input
                      className="outline-none bg-transparent"
                      placeholder="Search patient..."
                    />
                  </div>
                </div>

                {schedule.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No appointments scheduled
                  </p>
                )}

                <div className="space-y-4">
                  {schedule.map(slot => (
                    <div
                      key={slot._id}
                      className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border-l-4 border-teal-500"
                    >
                      <div>
                        <p className="font-bold">
                          {slot.patientName || 'Patient'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {slot.clinic} • Room {slot.room}
                        </p>
                      </div>

                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar size={14} />
                          {new Date(slot.date).toLocaleDateString()}
                        </div>
                        <div className="font-semibold">
                          {slot.time}
                        </div>
                      </div>

                      <span className="px-4 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {slot.status}
                      </span>

                      <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-teal-500 hover:text-white">
                          <ExternalLink size={16} />
                        </button>
                        <button className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-slate-100">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* RIGHT — SCHEDULE */}
            <div>
              <div className="bg-white rounded-3xl border p-8">
                <h3 className="text-xl font-bold mb-4">My Schedule</h3>

                <div className="h-40 rounded-2xl border border-dashed flex flex-col items-center justify-center text-teal-600 font-semibold">
                  <Calendar size={36} />
                  Monthly Planner
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-emerald-400">
                    Configure Availability
                  </button>
                  <button className="w-full py-3 rounded-xl border font-semibold">
                    Block Leave
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
