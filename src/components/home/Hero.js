import Link from "next/link";
export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-[#f4fffb] to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-start">

        {/* LEFT CONTENT */}
        <div className="pt-10">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-teal-500 rounded-full" />
            Now Open 24/7
          </span>

          {/* Heading */}
          <h1 className="text-[56px] leading-[1.1] font-extrabold text-gray-900">
            Sheikh Khalifa <br />
            Hospital <span className="text-teal-500">Fujairah</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Providing exceptional healthcare services with compassion and
            innovation. Your health is our priority.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex items-center gap-5">
            <Link href="/login" >
            <button  className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-7 py-3.5 rounded-full text-sm font-medium shadow-md hover:opacity-90 transition">
              Book Appointment →
            </button>
            </Link>
            <Link href="/services">
            <button className="px-7 py-3.5 rounded-full border border-teal-500 text-teal-600 text-sm font-medium hover:bg-teal-50 transition">
              Our Services
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
              <p className="text-3xl font-bold text-teal-500">24/7</p>
              <p className="text-sm text-gray-500 mt-1">Emergency</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-500">100K+</p>
              <p className="text-sm text-gray-500 mt-1">Patients</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative">
          {/* Floating cards */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <HeroCard
              title="Emergency"
              desc="24/7 Emergency Care"
              icon="📞"
              iconBg="bg-red-100 text-red-500"
            />
            <HeroCard
              title="Appointments"
              desc="Book or manage"
              icon="🩺"
              iconBg="bg-emerald-100 text-emerald-500"
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
          <div className="rounded-3xl bg-gradient-to-br from-teal-100 to-white h-[260px] flex items-center justify-center shadow-sm">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-2xl shadow-md">
              SK
            </div>
            <p className="absolute bottom-6 text-sm text-gray-500">
              Modern Healthcare Facility
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Small card component */
function HeroCard({ title, desc, icon, iconBg }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
