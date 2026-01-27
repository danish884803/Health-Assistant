export default function HospitalInfo() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Hospital Information
          </h2>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          <InfoCard
            icon="🕒"
            title="Working Hours"
            lines={[
              "Outpatient: 8:00 AM - 8:00 PM",
              "Emergency: 24/7",
              "Visiting: 9:00 AM - 9:00 PM",
            ]}
          />
          <InfoCard
            icon="📍"
            title="Location"
            lines={[
              "Sheikh Khalifa Hospital, Fujairah, UAE",
            ]}
          />
          <InfoCard
            icon="📞"
            title="Contact Us"
            lines={[
              "Phone: +971 9 XXX XXXX",
              "Email: info@skh-fujairah.ae",
            ]}
          />
        </div>

        {/* Bottom cards */}
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <SmallInfoCard
            icon="📅"
            title="Easy Booking"
            desc="Book appointments online anytime"
          />
          <SmallInfoCard
            icon="🛡️"
            title="Secure Records"
            desc="Your health data is protected"
          />
        </div>
      </div>
    </section>
  );
}

/* Large Card */
function InfoCard({ icon, title, lines }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-50 mb-6 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {title}
      </h3>
      <div className="space-y-2 text-sm text-gray-600">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}

/* Small Card */
function SmallInfoCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl px-10 py-6 shadow-sm border border-gray-100 flex items-center gap-5 min-w-[280px]">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-xl">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
