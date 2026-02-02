'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { ShieldCheck, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSecurityPage() {
  const { user, loading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [actorFilter, setActorFilter] = useState('ALL');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    fetch('/api/admin/audit-logs', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLogs(data.logs || []));
  }, [user]);

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;

  const filteredLogs = logs.filter(l =>
    actorFilter === 'ALL' ? true : l.actorModel === actorFilter
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-8">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Security &{' '}
                <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  Audit
                </span>
              </h1>
              <p className="text-gray-500 mt-1">
                System activity & compliance logs
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm">
              <Filter size={16} />
              <select
                value={actorFilter}
                onChange={e => setActorFilter(e.target.value)}
                className="outline-none"
              >
                <option value="ALL">All Actors</option>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left">Time</th>
                  <th className="px-6 py-4 text-left">Actor</th>
                  <th className="px-6 py-4 text-left">Action</th>
                  <th className="px-6 py-4 text-left">Target</th>
                  <th className="px-6 py-4 text-left">IP</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log._id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {log.actorModel}
                    </td>
                    <td className="px-6 py-4">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {log.targetType}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {log.ipAddress || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                No audit logs found
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
