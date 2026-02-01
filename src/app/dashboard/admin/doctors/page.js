'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDoctorsPage() {
  const { user, loading } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    clinic: '',
    room: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadDoctors();
  }, [user]);

  async function loadDoctors() {
    const res = await fetch('/api/admin/doctors', { credentials: 'include' });
    const data = await res.json();
    setDoctors(data.doctors || []);
  }

  function openAdd() {
    setEditingDoctor(null);
    setForm({
      name: '',
      email: '',
      password: '',
      department: '',
      clinic: '',
      room: '',
    });
    setModalOpen(true);
  }

  function openEdit(d) {
    setEditingDoctor(d);
    setForm({
      name: d.name,
      email: d.email,
      password: '',
      department: d.department || '',
      clinic: d.clinic || '',
      room: d.room || '',
    });
    setModalOpen(true);
  }

  async function saveDoctor() {
    const method = editingDoctor ? 'PUT' : 'POST';

    await fetch('/api/admin/doctors', {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...form,
        doctorId: editingDoctor?._id,
      }),
    });

    setModalOpen(false);
    loadDoctors();
  }

  async function deleteDoctor(id) {
    if (!confirm('Delete this doctor?')) return;

    await fetch('/api/admin/doctors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ doctorId: id }),
    });

    loadDoctors();
  }

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-6">

          <div className="flex justify-between">
            <h1 className="text-3xl font-extrabold">Doctor Management</h1>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-bold"
            >
              <Plus size={18} /> Add Doctor
            </button>
          </div>

          <div className="bg-white rounded-3xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Department</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map(d => (
                  <tr key={d._id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-4">{d.name}</td>
                    <td className="px-6 py-4">{d.email}</td>
                    <td className="px-6 py-4">{d.department}</td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <button onClick={() => openEdit(d)}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => deleteDoctor(d._id)}>
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md space-y-4">
            <div className="flex justify-between">
              <h2 className="font-bold text-xl">
                {editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X />
              </button>
            </div>

            {['name','email','password','department','clinic','room'].map(f => (
              <input
                key={f}
                type={f === 'password' ? 'password' : 'text'}
                placeholder={f}
                value={form[f]}
                onChange={e => setForm({ ...form, [f]: e.target.value })}
                className="w-full border rounded-xl p-3"
              />
            ))}

            <button
              onClick={saveDoctor}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold"
            >
              Save Doctor
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
