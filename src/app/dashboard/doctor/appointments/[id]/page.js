'use client';

import { useEffect, useState } from "react";
import { Activity, User, Mail, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useParams, useRouter } from "next/navigation";

export default function DoctorPatientView() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function loadPatient() {
      try {
        const res = await fetch(`/api/doctor/appointments/${id}/patient`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load patient");
        }
        setPatient(data.patient);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadPatient();
  }, [id]);
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6">   
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={40} /></div>
        ) : error ? (
          <div className="bg-white border border-red-100 rounded-3xl p-12 text-center shadow-sm">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-800">Error Loading Patient</h2>
            <p className="text-gray-500 mt-2 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold">Try Again</button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="bg-teal-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <User size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{patient.fullName}</h1>
                  <p className="opacity-80">Patient ID: {patient.patientId || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={20} className="text-teal-600" />
                <span className="font-medium">{patient.email}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Blood Group" value={patient.bloodGroup || "—"} />
                <StatCard label="Height" value={patient.heightCm ? `${patient.heightCm} cm` : "—"} />
                <StatCard label="Weight" value={patient.weightKg ? `${patient.weightKg} kg` : "—"} />
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-4">
                  <Activity className="text-teal-600" size={28} />
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Body Mass Index</p>
                    <p className="text-3xl font-black text-gray-800">{patient.bmi || "—"}</p>
                  </div>
                </div>
                {patient.bmi && (
                  <div className="text-right">
                    <span className="px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-bold uppercase tracking-wider">
                      {patient.bmi < 18.5 ? 'Underweight' : patient.bmi < 25 ? 'Healthy' : 'Overweight'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}