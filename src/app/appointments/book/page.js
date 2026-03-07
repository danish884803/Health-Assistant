'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BookAppointmentPage() {

  const router = useRouter();

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState(null);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [slotBooked, setSlotBooked] = useState(false);

  /* =========================
      LOAD DEPARTMENTS
  ========================= */

  useEffect(() => {

    fetch('/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []));

  }, []);

  /* =========================
      LOAD DOCTORS
  ========================= */

  useEffect(() => {

    if (!department) return;

    fetch(`/api/doctor?department=${encodeURIComponent(department)}`)
      .then(res => res.json())
      .then(data => setDoctors(data.doctors || []));

  }, [department]);

  /* =========================
      CHECK SLOT
  ========================= */

  useEffect(() => {

    if (!doctor || !date || !time) {
      setSlotBooked(false);
      return;
    }

    fetch(
      `/api/appointments/check?doctorId=${doctor._id}&date=${date}&time=${time}`
    )
      .then(res => res.json())
      .then(data => setSlotBooked(data.booked))
      .catch(() => setSlotBooked(false));

  }, [doctor, date, time]);

  /* =========================
      BOOK APPOINTMENT
  ========================= */

  async function handleSubmit() {

    if (!doctor || !date || !time) {
      alert('Fill all fields');
      return;
    }

    if (slotBooked) {
      alert('This slot is already booked');
      return;
    }

    await fetch('/api/appointments', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',

      body: JSON.stringify({
        doctorId: doctor._id,
        doctorName: doctor.name,
        department: doctor.department,
        clinic: doctor.clinic,
        room: doctor.room,
        roomId: doctor.roomId?._id,
        date,
        time
      })

    });

    router.push('/appointments');
  }

  return (

    <div className="min-h-screen bg-slate-50">

      <Header />

      <main className="pt-24 pb-20 max-w-xl mx-auto px-4 sm:px-6">

        {/* BACK BUTTON */}

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-teal-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        {/* CARD */}

        <div className="bg-white rounded-3xl border p-6 sm:p-8 space-y-5 shadow-sm">

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Book Appointment
          </h1>

          {/* DEPARTMENT */}

          <select
            className="w-full border rounded-xl p-3 text-sm"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setDoctor(null);
            }}
          >

            <option value="">Select Department</option>

            {departments.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}

          </select>

          {/* DOCTOR */}

          <select
            className="w-full border rounded-xl p-3 text-sm"
            disabled={!department}
            value={doctor?.name || ''}
            onChange={(e) =>
              setDoctor(doctors.find(d => d.name === e.target.value))
            }
          >

            <option value="">Select Doctor</option>

            {doctors.map(d => (
              <option key={d._id} value={d.name}>
                {d.name}
              </option>
            ))}

          </select>

          {/* DOCTOR INFO */}

          {doctor && (

            <div className="text-sm text-gray-600 bg-slate-50 p-3 rounded-lg">

              Clinic: {doctor.clinic}
              <br />
              Room: {doctor.room}

            </div>

          )}

          {/* DATE */}

          <input
            type="date"
            className="w-full border rounded-xl p-3 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* TIME */}

          <input
            type="time"
            className={`w-full border rounded-xl p-3 text-sm ${
              slotBooked ? 'border-red-500 ring-1 ring-red-300' : ''
            }`}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          {/* SLOT WARNING */}

          {slotBooked && (

            <p className="text-sm text-red-600 font-semibold">

              ❌ This slot is already booked. Please choose another time.

            </p>

          )}

          {/* SUBMIT BUTTON */}

          <button
            onClick={handleSubmit}
            disabled={slotBooked}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-400
            text-white rounded-xl py-3 font-bold text-sm sm:text-base
            disabled:opacity-50 transition hover:opacity-90"
          >

            Confirm Appointment

          </button>

        </div>

      </main>

      <Footer />

    </div>

  );
}