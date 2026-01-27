'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  // ✅ REQUIRED STATES
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [emiratesId, setEmiratesId] = useState('');
  const [dob, setDob] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        email,
        password,
        phone,
        emiratesId,
        dob,
      }),
    });

    if (res.ok) {
      router.push(`/verify-email?email=${email}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <div className="-top-40 -right-40 absolute w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="-bottom-40 -left-40 absolute w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Back */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-400 p-6 text-center text-white">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <span className="font-bold text-2xl">SK</span>
            </div>
            <h1 className="text-xl font-semibold">Create Patient Account</h1>
            <p className="text-white/70 text-sm mt-1">
              Sheikh Khalifa Hospital – Fujairah
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 py-4">
            <Step active={step === 1}>1</Step>
            <div className={`h-1 w-10 ${step === 2 ? 'bg-teal-500' : 'bg-gray-200'}`} />
            <Step active={step === 2}>2</Step>
          </div>

          {/* Forms */}
          <div className="p-6">
            <AnimatePresence mode="wait">

              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Input icon={User} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" />
                  <Input icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
                  <Input icon={ShieldCheck} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create Password (min 8 chars)" />
                  <Input icon={Phone} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 123 4567" />

                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-white flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Input icon={Calendar} type="date" value={dob} onChange={e => setDob(e.target.value)} />
                  <Input icon={ShieldCheck} value={emiratesId} onChange={e => setEmiratesId(e.target.value)} placeholder="Emirates ID (784-XXXX-XXXXXXX-X)" />

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRegister}
                      disabled={loading}
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-white"
                    >
                      {loading ? 'Registering…' : 'Register'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL HELPERS ---------- */
function Step({ active, children }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
      ${active ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
      {children}
    </div>
  );
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        {...props}
        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
      />
    </div>
  );
}
