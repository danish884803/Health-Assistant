import Link from "next/link";
import { Bot, Sparkles } from "lucide-react"; 

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-[#f4fffb] to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-start">

        {/* LEFT CONTENT */}
        <div className="pt-10">
          <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            AI-Powered Healthcare
          </span>

          <h1 className="text-[56px] leading-[1.1] font-extrabold text-gray-900">
            Sheikh Khalifa <br />
            Hospital <span className="text-teal-500">Fujairah</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Experience the future of care. Chat with our <strong>AI Health Assistant</strong> to book appointments, find specialists, or navigate the facility instantly.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/assistant">
              <button className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-500 text-white px-8 py-4 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                <Bot size={20} />
                Chat with AI Assistant
              </button>
            </Link>
            <Link href="/login">
              <button className="px-7 py-3.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                Book Appointment
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex items-center gap-16">
            <div>
              <p className="text-3xl font-bold text-teal-500">50+</p>
              <p className="text-sm text-gray-500 mt-1">Specialists</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-500">Instant</p>
              <p className="text-sm text-gray-500 mt-1">AI Support</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative top-8 ">
          <div className="grid  grid-cols-2 gap-6 mb-6">
            <Link href="/assistant" className="group">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-2xl p-5 shadow-lg transform group-hover:-translate-y-1 transition text-white">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white/20">
                  <Sparkles size={20} />
                </div>
                <p className="font-bold text-white">AI Assistant</p>
                <p className="text-xs text-teal-50 opacity-90">Ask anything 24/7</p>
              </div>
            </Link>
            
            <HeroCard
              title="Emergency"
              desc="24/7 Care"
              icon="📞"
              iconBg="bg-red-100 text-red-500"
            />
            <HeroCard
              title="Find a Doctor"
              desc="Browse specialists"
              icon="📍"
              iconBg="bg-blue-100 text-blue-500"
            />
            <HeroCard
              title="Visiting Hours"
              desc="9 AM - 9 PM"
              icon="🕒"
              iconBg="bg-amber-100 text-amber-500"
            />
          </div>

          {/* Big card */}
          <div className="rounded-3xl bg-gradient-to-br from-teal-100 to-white h-[260px] flex flex-col items-center justify-center shadow-sm border border-teal-50">
             <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                    SK
                </div>
                <div className="absolute -top-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
                    <Bot size={20} className="text-teal-500" />
                </div>
             </div>
            <p className="mt-4 font-medium text-gray-700">Modern Healthcare Facility</p>
            <p className="text-xs text-gray-400">Powered by Smart AI Technology</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCard({ title, desc, icon, iconBg }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-50">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}