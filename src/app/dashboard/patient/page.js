'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Activity,
  FileText,
  User,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/context/AuthContext';

export default function PatientDashboard() {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  /* ✅ SAFE INITIALS (NO CRASH EVER) */
  const initials = useMemo(() => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [user?.fullName]);

  /* ✅ LOAD APPOINTMENTS FROM MONGODB */
  useEffect(() => {
    if (!user?.id) return;

    async function loadAppointments() {
      try {
        const res = await fetch('/api/appointments', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setAppointments(data.appointments || []);
        }
      } catch (err) {
        console.error('Failed to load appointments');
      } finally {
        setLoadingAppointments(false);
      }
    }

    loadAppointments();
  }, [user?.id]);

  /* ⛔ WAIT FOR AUTH */
  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* ===== HEADER ===== */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Welcome,{' '}
                <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  {user.fullName}
                </span>
              </h1>
              <p className="text-gray-500 mt-1">
                Patient ID: {user.patientId || 'SKGH-PENDING'}
              </p>
            </div>

            <Link
              href="/appointments/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold
                         bg-gradient-to-r from-teal-500 to-emerald-400 shadow-lg hover:opacity-90"
            >
              <PlusCircle size={20} />
              Book Appointment
            </Link>
          </div>

          {/* ===== GRID ===== */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ===== LEFT COLUMN ===== */}
            <div className="lg:col-span-2 space-y-8">

              {/* STATS */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border p-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center">
                    <Activity />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Type</p>
                    <p className="text-xl font-bold text-gray-900">—</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border p-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <FileText />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reports</p>
                    <p className="text-xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              {/* APPOINTMENTS */}
              <div className="bg-white rounded-3xl border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Upcoming Appointments</h3>
                  <Link
                    href="/appointments"
                    className="text-teal-600 font-semibold text-sm"
                  >
                    View all
                  </Link>
                </div>

                {loadingAppointments && (
                  <p className="text-sm text-gray-500">
                    Loading appointments...
                  </p>
                )}

                {!loadingAppointments && appointments.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No upcoming appointments
                  </p>
                )}

                <div className="space-y-4">
                  {appointments.map((app) => (
                    <div
                      key={app._id}
                      className="flex flex-wrap items-center justify-between gap-4
                                 p-5 bg-slate-50 rounded-2xl border-l-4 border-teal-500"
                    >
                      <div>
                        <p className="font-bold">{app.doctorName}</p>
                        <p className="text-sm text-gray-500">
                          {app.department} • {app.clinic} • Room {app.room}
                        </p>
                      </div>

                      <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(app.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {app.time}
                        </div>
                      </div>

                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold
                          ${
                            app.status === 'booked'
                              ? 'bg-green-100 text-green-700'
                              : app.status === 'rescheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {app.status}
                      </span>

                      <Link href="/map?from=dashboard">
  <MapPin size={16} />
</Link>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== RIGHT COLUMN ===== */}
            <div className="space-y-8">

              {/* PROFILE */}
              <div className="bg-white rounded-3xl border p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-full
                               bg-gradient-to-r from-teal-500 to-emerald-400
                               flex items-center justify-center
                               text-white font-bold text-lg"
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold">{user.fullName}</p>
                    <p className="text-sm text-gray-500">
                      United Arab Emirates
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50"
                  >
                    <User size={18} /> Profile Settings
                  </Link>

                  <Link
                    href="/medical-history"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50"
                  >
                    <FileText size={18} /> Medical History
                  </Link>

                  <Link
                    href="/vitals"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50"
                  >
                    <Activity size={18} /> Vital Logs
                  </Link>
                </div>
              </div>

              {/* MAP PROMO */}
              <div className="rounded-3xl p-8 text-white
                              bg-gradient-to-r from-teal-500 to-emerald-400
                              relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold mb-2">
                    Hospital Map
                  </h3>
                  <p className="text-white/90 mb-6">
                    Navigate easily using our interactive 2D map.
                  </p>
                  <Link
  href="/map?from=dashboard"
  className="inline-flex items-center gap-2 bg-white text-teal-600 px-5 py-3 rounded-xl font-bold"
>
  Open Map Explorer
</Link>

                </div>

                <MapPin
                  className="absolute right-6 bottom-6 opacity-20"
                  size={80}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
