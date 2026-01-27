'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return null;

  // ✅ FIX: normalize name for doctor & patient
  const displayName =
    user?.fullName || user?.name || 'User';

  const initial =
    displayName?.charAt(0)?.toUpperCase() || 'U';

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <header className="w-full bg-white border-b border-gray-100 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LEFT — Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm">
            SK
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-gray-900 text-sm">
              Sheikh Khalifa Hospital
            </p>
            <p className="text-xs text-gray-500">Fujairah</p>
          </div>
        </div>

        {/* CENTER — Nav */}
        <nav className="hidden lg:flex items-center gap-10 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <Link href="/departments" className="hover:text-teal-600">Departments</Link>
          <Link href="/services" className="hover:text-teal-600">Services</Link>
          <Link href="/map" className="hover:text-teal-600">Hospital Map</Link>
          <Link href="/contact" className="hover:text-teal-600">Contact</Link>
        </nav>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3">

          {/* Language */}
          <button className="px-4 py-2 rounded-full border border-teal-500 text-teal-600 text-sm">
            🌐 العربية
          </button>

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full border border-teal-500 text-teal-600 text-sm"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 rounded-full border border-emerald-500 text-emerald-600 text-sm"
              >
                Register
              </Link>
            </>
          )}

          {/* LOGGED IN */}
          {user && (
            <>
              {/* User badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 border">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                  {initial}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {displayName}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-red-500 text-red-600 text-sm flex items-center gap-1 hover:bg-red-50"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          )}

          {/* CTA */}
          <Link
            href="/appointments"
            className="px-5 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-400"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </header>
  );
}
