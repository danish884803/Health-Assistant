'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import AdminMapEditor from '@/components/map/AdminMapEditor';
import { useAuth } from '@/context/AuthContext';
import { Layers, DoorOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminHospitalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 space-y-6">
        <h1 className="text-3xl font-extrabold">
          Hospital <span className="text-teal-600">Map Management</span>
        </h1>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard/admin/hospital/floors')}
            className="flex items-center gap-2 bg-white border rounded-xl px-5 py-3 font-semibold hover:shadow"
          >
            <Layers size={18} /> Manage Floors
          </button>

          <button
            onClick={() => router.push('/dashboard/admin/hospital/rooms')}
            className="flex items-center gap-2 bg-white border rounded-xl px-5 py-3 font-semibold hover:shadow"
          >
            <DoorOpen size={18} /> Manage Rooms
          </button>
        </div>

        {/* MAP EDITOR */}
        <AdminMapEditor />
      </main>

      <Footer />
    </div>
  );
}
