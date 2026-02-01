'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  Calendar,
  Clock,
  UserCog,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminAppointmentsDashboard() {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('today');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadData();
  }, [user]);

  async function loadData() {
    const res = await fetch('/api/admin/appointments', {
      credentials: 'include',
    });
    const data = await res.json();
    setAppointments(data.appointments || []);
    setDoctors(data.doctors || []);
  }

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;

  const todayStr = new Date().toDateString();

  const filteredAppointments = appointments.filter(a => {
    const d = new Date(a.date).toDateString();
    if (filter === 'today') return d === todayStr;
    if (filter === 'upcoming') return new Date(a.date) > new Date();
    if (filter === 'completed') return a.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Appointments{' '}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                Monitor
              </span>
            </h1>

            <div className="flex gap-2">
              {['today','upcoming','completed','all'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border
                    ${filter === f
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-600'}
                  `}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* ================= APPOINTMENTS ================= */}
          <div className="bg-white rounded-3xl border p-8">
            <h3 className="text-xl font-bold mb-6">All Appointments</h3>

            {filteredAppointments.length === 0 ? (
              <p className="text-gray-500">No appointments</p>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map(a => (
                  <div
                    key={a._id}
                    className="flex flex-wrap justify-between items-center p-5 bg-slate-50 rounded-2xl border"
                  >
                    <div>
                      <p className="font-bold">{a.patientName}</p>
                      <p className="text-sm text-gray-500">
                        Dr. {a.doctorName} • {a.department}
                      </p>
                      <p className="text-xs text-gray-400">
                        {a.clinic} • Room {a.room}
                      </p>
                    </div>

                    <div className="text-sm text-right">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(a.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {a.time}
                      </div>
                    </div>

                    <span className={`px-4 py-1 rounded-full text-xs font-bold
                      ${a.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'}
                    `}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= DOCTOR AVAILABILITY ================= */}
          <div className="bg-white rounded-3xl border p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserCog size={22} /> Doctor Availability
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(d => (
                <div
                  key={d._id}
                  className="border rounded-2xl p-6 bg-slate-50"
                >
                  <h4 className="font-bold text-lg mb-1">{d.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {d.department}
                  </p>

                  {d.availability ? (
                    <div className="text-sm space-y-1">
                      <p>
                        <b>Days:</b> {d.availability.days?.join(', ') || '—'}
                      </p>
                      <p>
                        <b>Time:</b> {d.availability.startTime} – {d.availability.endTime}
                      </p>
                      <p>
                        <b>Slot:</b> {d.availability.slotDuration} mins
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Availability not set
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
