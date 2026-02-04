'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Trash2, Plus } from 'lucide-react';

export default function AdminFloorsPage() {
  const [floors, setFloors] = useState([]);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');

  async function load() {
    const res = await fetch('/api/admin/floors', { credentials: 'include' });
    const data = await res.json();
    setFloors(data.floors || []);
  }

  useEffect(() => { load(); }, []);

  async function addFloor() {
    await fetch('/api/admin/floors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, level })
    });
    setName(''); setLevel('');
    load();
  }

  async function del(id) {
    await fetch('/api/admin/floors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id })
    });
    load();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6 space-y-6">
        <h1 className="text-2xl font-bold">Hospital Floors</h1>

        <div className="bg-white p-4 rounded-xl flex gap-3">
          <input className="border p-2 rounded w-full"
            placeholder="Floor Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input className="border p-2 rounded w-24"
            placeholder="Level"
            value={level}
            onChange={e => setLevel(e.target.value)}
          />
          <button onClick={addFloor} className="bg-teal-600 text-white px-4 rounded">
            <Plus />
          </button>
        </div>

        {floors.map(f => (
          <div key={f._id} className="bg-white border rounded-xl p-4 flex justify-between">
            <span>{f.name} (Level {f.level})</span>
            <button onClick={() => del(f._id)}>
              <Trash2 className="text-red-600" />
            </button>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
