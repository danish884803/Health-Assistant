'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  HeartPulse,
  Stethoscope,
  Ambulance,
  Microscope,
  Baby,
  Brain,
  ShieldPlus,
  Clock,
} from 'lucide-react';

const services = [
  {
    title: 'Cardiology',
    desc: 'Comprehensive heart care including diagnosis, treatment, and rehabilitation.',
    icon: HeartPulse,
  },
  {
    title: 'General Consultation',
    desc: 'Primary healthcare services for routine checkups and common illnesses.',
    icon: Stethoscope,
  },
  {
    title: 'Emergency Care',
    desc: '24/7 emergency services with rapid response and advanced life support.',
    icon: Ambulance,
  },
  {
    title: 'Laboratory Services',
    desc: 'Accurate diagnostic testing with modern laboratory equipment.',
    icon: Microscope,
  },
  {
    title: 'Pediatrics',
    desc: 'Specialized medical care for infants, children, and adolescents.',
    icon: Baby,
  },
  {
    title: 'Neurology',
    desc: 'Expert care for brain, spine, and nervous system disorders.',
    icon: Brain,
  },
  {
    title: 'Health Insurance Support',
    desc: 'Assistance with insurance approvals and medical documentation.',
    icon: ShieldPlus,
  },
  {
    title: '24/7 Outpatient Services',
    desc: 'Round-the-clock outpatient consultations and follow-ups.',
    icon: Clock,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* ===== HERO ===== */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Our <span className="text-teal-600">Medical Services</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Sheikh Khalifa Hospital Fujairah provides a wide range of healthcare
              services delivered by experienced professionals using modern facilities.
            </p>
          </div>

          {/* ===== SERVICES GRID ===== */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl border p-6 text-center hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ===== CTA ===== */}
          <div className="mt-20 text-center bg-gradient-to-r from-teal-500 to-emerald-400 rounded-3xl p-10 text-white">
            <h2 className="text-2xl font-extrabold mb-3">
              Need medical assistance?
            </h2>
            <p className="text-white/90 mb-6">
              Book an appointment with our specialists or visit our hospital map
              to find the right department quickly.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/login"
                className="px-6 py-3 bg-white text-teal-600 font-bold rounded-xl shadow hover:scale-105 transition-transform"
              >
                Book Appointment
              </a>
              <a
                href="/map"
                className="px-6 py-3 border border-white text-white font-bold rounded-xl hover:bg-white/10"
              >
                Open Hospital Map
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
