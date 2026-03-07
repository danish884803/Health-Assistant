'use client';

import Link from 'next/link';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  const role = user?.role || 'guest';

  const isGuest = !user;
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';
  const isAdmin = role === 'admin';

  const displayName = user?.fullName || user?.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const dashboardHref = isAdmin
    ? '/dashboard/admin'
    : isDoctor
    ? '/dashboard/doctor'
    : '/dashboard/patient';

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <header className="w-full bg-white border-b fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold">
            SK
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="font-semibold text-gray-900 text-sm">
              Sheikh Khalifa Hospital
            </p>
            <p className="text-xs text-gray-500">Fujairah</p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <Link href="/departments" className="hover:text-teal-600">Departments</Link>
          <Link href="/services" className="hover:text-teal-600">Services</Link>
          <Link href="/map" className="hover:text-teal-600">Hospital Map</Link>

          {isGuest && (
            <Link href="/contact" className="hover:text-teal-600">
              Contact
            </Link>
          )}

          {!isGuest && (
            <Link
              href={dashboardHref}
              className="flex items-center gap-2 font-semibold text-teal-600"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}
        </nav>

        {/* RIGHT ACTIONS (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-3">

          {isGuest && (
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

          {user && (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 border">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                  {initial}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {displayName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-red-500 text-red-600 text-sm flex items-center gap-1 hover:bg-red-50"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          )}

          {isPatient && (
            <Link
              href="/appointments/book"
              className="px-5 py-2 rounded-full text-sm font-medium text-white
              bg-gradient-to-r from-teal-500 to-emerald-400"
            >
              Book Appointment
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg border"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white px-6 py-5 space-y-4 text-sm">

          <Link href="/" className="block">Home</Link>
          <Link href="/departments" className="block">Departments</Link>
          <Link href="/services" className="block">Services</Link>
          <Link href="/map" className="block">Hospital Map</Link>

          {isGuest && <Link href="/contact">Contact</Link>}

          {!isGuest && (
            <Link href={dashboardHref} className="block font-semibold text-teal-600">
              Dashboard
            </Link>
          )}

          {isGuest && (
            <>
              <Link href="/login" className="block">Login</Link>
              <Link href="/register" className="block">Register</Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="text-red-600 flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}