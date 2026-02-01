// 'use client';

// import { useEffect, useState } from 'react';
// import Header from '@/components/common/Header';
// import Footer from '@/components/common/Footer';
// import { Users, Search, Eye } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// export default function AdminPatientsPage() {
//   const { user, loading } = useAuth();
//   const [patients, setPatients] = useState([]);
//   const [query, setQuery] = useState('');

//   useEffect(() => {
//     if (!user || user.role !== 'admin') return;

//     async function loadPatients() {
//       const res = await fetch('/api/admin/patients', {
//         credentials: 'include',
//       });
//       const data = await res.json();
//       setPatients(data.patients || []);
//     }

//     loadPatients();
//   }, [user]);

//   if (loading) return null;
//   if (!user || user.role !== 'admin') return null;

//   const filtered = patients.filter(p =>
//     p.fullName.toLowerCase().includes(query.toLowerCase()) ||
//     p.patientId?.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />

//       <main className="pt-28 pb-20">
//         <div className="max-w-7xl mx-auto px-6 space-y-8">

//           {/* HEADER */}
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-extrabold text-gray-900">
//                 Patient{' '}
//                 <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
//                   Management
//                 </span>
//               </h1>
//               <p className="text-gray-500 mt-1">
//                 Non-medical patient information
//               </p>
//             </div>

//             <div className="flex items-center gap-2 border px-4 py-2 rounded-xl bg-white">
//               <Search size={16} />
//               <input
//                 className="outline-none text-sm"
//                 placeholder="Search patient..."
//                 value={query}
//                 onChange={e => setQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* TABLE */}
//           <div className="bg-white rounded-3xl border overflow-hidden">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-100 text-gray-600">
//                 <tr>
//                   <th className="text-left px-6 py-4">Patient ID</th>
//                   <th className="text-left px-6 py-4">Name</th>
//                   <th className="text-left px-6 py-4">Email</th>
//                   <th className="text-left px-6 py-4">Phone</th>
//                   <th className="text-right px-6 py-4">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filtered.map(p => (
//                   <tr
//                     key={p._id}
//                     className="border-t hover:bg-slate-50 transition"
//                   >
//                     <td className="px-6 py-4 font-semibold text-teal-600">
//                       {p.patientId}
//                     </td>
//                     <td className="px-6 py-4">{p.fullName}</td>
//                     <td className="px-6 py-4">{p.email}</td>
//                     <td className="px-6 py-4">{p.phone || '—'}</td>
//                     <td className="px-6 py-4 text-right">
//                       <button className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:underline">
//                         <Eye size={16} />
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filtered.length === 0 && (
//               <div className="text-center py-10 text-gray-500">
//                 No patients found
//               </div>
//             )}
//           </div>

//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Search, Eye, Trash2, X, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminPatientsPage() {
  const { user, loading } = useAuth();
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [phone, setPhone] = useState('');
  const [emiratesId, setEmiratesId] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadPatients();
  }, [user]);

  async function loadPatients() {
    const res = await fetch('/api/admin/patients', { credentials: 'include' });
    const data = await res.json();
    setPatients(data.patients || []);
  }

  function openEdit(p) {
    setActivePatient(p);
    setPhone(p.phone || '');
    setEmiratesId(p.emiratesId || '');
  }

  async function saveChanges() {
    await fetch('/api/admin/patients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId: activePatient._id,
        phone,
        emiratesId,
      }),
    });

    setActivePatient(null);
    loadPatients();
  }

  async function deletePatient(id) {
    if (!confirm('Delete this patient permanently?')) return;

    await fetch('/api/admin/patients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: id }),
    });

    loadPatients();
  }

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-8">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Patient{' '}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>

            <div className="flex items-center gap-2 border px-4 py-2 rounded-xl bg-white">
              <Search size={16} />
              <input className="outline-none text-sm" placeholder="Search..." />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left">Patient ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {patients.map(p => (
                  <tr key={p._id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-teal-600">
                      {p.patientId}
                    </td>
                    <td className="px-6 py-4">{p.fullName}</td>
                    <td className="px-6 py-4">{p.email}</td>
                    <td className="px-6 py-4">{p.phone || '—'}</td>
                    <td className="px-6 py-4 text-right flex gap-3 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-teal-600 font-bold text-sm flex items-center gap-1"
                      >
                        <Eye size={16} /> View
                      </button>

                      <button
                        onClick={() => deletePatient(p._id)}
                        className="text-red-600 font-bold text-sm flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {patients.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No patients found
              </div>
            )}
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      {activePatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Patient</h2>
              <button onClick={() => setActivePatient(null)}>
                <X />
              </button>
            </div>

            <input
              className="w-full border rounded-xl p-3"
              placeholder="Phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />

            <input
              className="w-full border rounded-xl p-3"
              placeholder="Emirates ID"
              value={emiratesId}
              onChange={e => setEmiratesId(e.target.value)}
            />

            <button
              onClick={saveChanges}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
