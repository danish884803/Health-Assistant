'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Activity,
  FileText,
  User,
  PlusCircle,
} from 'lucide-react';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/context/AuthContext';
import Chatbot from '@/components/chat/Chatbot';
export default function PatientDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  // ✅ NEW: profile data
  const [profile, setProfile] = useState(null);

  const initials = useMemo(() => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [user?.fullName]);

  /* =========================
     LOAD APPOINTMENTS
  ========================= */
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
      } catch {
        console.error('Failed to load appointments');
      } finally {
        setLoadingAppointments(false);
      }
    }

    loadAppointments();
  }, [user?.id]);

  /* =========================
     LOAD PROFILE (BLOOD TYPE)
  ========================= */
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile', {
          credentials: 'include',
        });

        if (!res.ok) return;

        const data = await res.json();
        setProfile(data.user);
      } catch {
        console.error('Failed to load profile');
      }
    }

    loadProfile();
  }, []);

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
                         bg-gradient-to-r from-teal-500 to-emerald-400 shadow-lg hover:opacity-90 transition-all"
            >
              <PlusCircle size={20} />
              Book Appointment
            </Link>
          </div>

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
                    <p className="text-sm text-gray-500 font-medium">
                      Blood Type
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        profile?.bloodGroup
                          ? 'text-gray-900'
                          : 'text-red-500'
                      }`}
                    >
                      {profile?.bloodGroup || 'Update Profile'}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border p-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <FileText />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Reports</p>
                    <p className="text-xl font-bold text-gray-900">
                      {appointments.filter(a => a.medicalSummary).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* APPOINTMENTS */}
              <div className="bg-white rounded-3xl border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Upcoming Appointments
                  </h3>
                  <Link
                    href="/appointments"
                    className="text-teal-600 font-bold text-sm hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {loadingAppointments ? (
                  <p className="text-sm text-gray-500">
                    Loading appointments...
                  </p>
                ) : appointments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-10">
                    No upcoming appointments found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map(app => (
                      <div
                        key={app._id}
                        className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border-l-4 border-teal-500"
                      >
                        <div className="flex-1 min-w-[200px]">
                          <p className="font-bold text-gray-900">
                            {app.doctorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {app.department} • Room {app.room}
                          </p>
                        </div>

                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2 font-medium">
                            <Calendar
                              size={14}
                              className="text-teal-600"
                            />
                            {new Date(app.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock
                              size={14}
                              className="text-teal-600"
                            />
                            {app.time}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className={`px-4 py-1 rounded-full text-xs font-bold uppercase
                              ${
                                app.status === 'booked'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                          >
                            {app.status}
                          </span>

                          <button
                            onClick={() => {
                              if (!app.roomId) {
                                alert(
                                  'Location detail not available for this room.'
                                );
                                return;
                              }
                              router.push(
                                `/map?room=${app.roomId}&from=dashboard`
                              );
                            }}
                            className="p-2 bg-white border rounded-lg hover:bg-teal-50 text-teal-600"
                            title="View Location on Map"
                          >
                            <MapPin size={18} />
                          </button>
                           {app.medicalSummary && (
                              <a
                                href={`/api/appointments/${app._id}/summary/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm text-teal-600 font-bold hover:bg-teal-50 transition-colors"
                              >
                                <FileText size={16} />
                                PDF
                              </a>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ===== RIGHT COLUMN ===== */}
            <div className="space-y-8">

              {/* PROFILE CARD */}
              <div className="bg-white rounded-3xl border p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-500">
                      United Arab Emirates
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-medium text-gray-700"
                >
                  <User size={18} className="text-teal-600" />
                  Profile Settings
                </Link>
              </div>

              {/* MAP PROMO */}
              <div className="rounded-3xl p-8 text-white bg-gradient-to-br from-teal-600 to-emerald-500 shadow-xl">
                <h3 className="text-2xl font-extrabold mb-2">
                  Hospital Map
                </h3>
                <p className="text-white/90 text-sm mb-6">
                  Navigate easily using our interactive hospital map.
                </p>
                <Link
                  href="/map?from=dashboard"
                  className="inline-flex items-center gap-2 bg-white text-teal-600 px-5 py-3 rounded-xl font-bold"
                >
                  Open Map Explorer
                </Link>
              </div>

            </div>
          </div>
        </div>
        <Chatbot/>
      </main>

      <Footer />
    </div>
  );
}
