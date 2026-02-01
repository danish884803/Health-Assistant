'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Link from 'next/link';

import {
  Users,
  UserCog,
  CalendarClock,
  Hospital,
  MessageCircle,
  ShieldCheck,
  Activity,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;

  const stats = [
    {
      label: 'Total Patients',
      value: '—',
      icon: <Users size={22} />,
    },
    {
      label: 'Doctors',
      value: '—',
      icon: <UserCog size={22} />,
    },
    {
      label: 'Appointments',
      value: '—',
      icon: <CalendarClock size={22} />,
    },
    {
      label: 'System Health',
      value: 'OK',
      icon: <Activity size={22} />,
    },
  ];

const modules = [
  {
    title: 'Patient Management',
    desc: 'Profiles, IDs, demographics',
    icon: <Users size={28} />,
    href: '/dashboard/admin/patients',
  },
  {
    title: 'Doctor Management',
    desc: 'Doctors, schedules, availability',
    icon: <UserCog size={28} />,
    href: '/dashboard/admin/doctors',
  },
  {
    title: 'Hospital Setup',
    desc: 'Clinics, rooms, floors, maps',
    icon: <Hospital size={28} />,
    href: '/dashboard/admin/hospital',
  },
  {
    title: 'Appointments',
    desc: 'Monitoring & analytics',
    icon: <CalendarClock size={28} />,
    href: '/dashboard/admin/appointments',
  },
  {
    title: 'Chatbot & AI',
    desc: 'Prompts, voice flows, OpenAI',
    icon: <MessageCircle size={28} />,
    href: '/dashboard/admin/chatbot',
  },
  {
    title: 'Security & Audit',
    desc: 'Logs, roles, compliance',
    icon: <ShieldCheck size={28} />,
    href: '/dashboard/admin/audit',
  },
];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">

          {/* ===== HEADER ===== */}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                System{' '}
                <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  Administrator
                </span>
              </h1>
              <p className="text-gray-500 mt-1">
                Hospital operations & configuration
              </p>
            </div>

            <div className="flex items-center gap-2 px-5 py-3 bg-white border rounded-xl text-sm font-semibold text-gray-600">
              <Settings size={16} />
              System Live • {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* ===== STATS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white border rounded-2xl p-6 flex items-center gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {s.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== MODULE GRID ===== */}
          <div className="bg-white rounded-3xl border p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Administration Modules
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((m, i) => (
                <Link
                 href={m.href}
             className="group border rounded-2xl p-6 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer bg-slate-50 block"
                    key={i}>

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-white flex items-center justify-center mb-4">
                    {m.icon}
                  </div>

                  <h4 className="font-bold text-gray-900 mb-1">
                    {m.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {m.desc}
                  </p>

                  <div className="mt-4 text-sm font-semibold text-teal-600 group-hover:underline">
                    Open →
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
