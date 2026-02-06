'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminRoomsPage() {
  const { user, loading } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);

  const [form, setForm] = useState({
    name: '',
    floorId: '',
    type: 'department',
    gridArea: '',
  });
async function loadRooms() {
  const res = await fetch('/api/admin/rooms', { credentials: 'include' });

  if (!res.ok) {
    console.error('Rooms fetch failed');
    return;
  }

  const text = await res.text();
  if (!text) {
    console.warn('Empty response from /api/admin/rooms');
    return;
  }

  const data = JSON.parse(text);
  setRooms(data.rooms || []);
}

  async function loadFloors() {
    const res = await fetch('/api/admin/floors', { credentials: 'include' });
    const data = await res.json();
    setFloors(data.floors || []);
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadRooms();
    loadFloors();
  }, [user]);

  async function addRoom() {
    if (!form.name || !form.floorId || !form.gridArea) {
      alert('Fill all fields');
      return;
    }

    await fetch('/api/admin/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });

    setForm({ name: '', floorId: '', type: 'department', gridArea: '' });
    loadRooms();
  }

  async function deleteRoom(id) {
    if (!confirm('Delete this room?')) return;

    await fetch('/api/admin/rooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });

    loadRooms();
  }

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20 max-w-6xl mx-auto px-6 space-y-8">
        <h1 className="text-3xl font-extrabold">
          Hospital <span className="text-teal-600">Rooms</span>
        </h1>

        <div className="bg-white border rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-lg">Add New Room</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border rounded-xl p-3"
              placeholder="Room Name (e.g. Cardiology)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <select
              className="border rounded-xl p-3"
              value={form.floorId}
              onChange={e => setForm({ ...form, floorId: e.target.value })}
            >
              <option value="">Select Floor</option>
              {floors.map(f => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              className="border rounded-xl p-3"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="department">Department</option>
              <option value="service">Service</option>
              <option value="facility">Facility</option>
            </select>

            <input
              className="border rounded-xl p-3"
              placeholder="Grid Area (e.g. 1 / 1 / 2 / 3)"
              value={form.gridArea}
              onChange={e => setForm({ ...form, gridArea: e.target.value })}
            />
          </div>

          <button
            onClick={addRoom}
            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            <Plus size={18} /> Add Room
          </button>
        </div>

        {/* ================= ROOM LIST ================= */}
        <div className="bg-white border rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">Room</th>
                <th className="px-6 py-4 text-left">Floor</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Grid</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r._id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold">{r.name}</td>
                  <td className="px-6 py-4">{r.floorId?.name}</td>
                  <td className="px-6 py-4 capitalize">{r.type}</td>
                  <td className="px-6 py-4 text-xs">{r.gridArea}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteRoom(r._id)}>
                      <Trash2 className="text-red-600" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rooms.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No rooms created yet
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
