export default function Features() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Our Departments
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Comprehensive medical care across all specialties
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DepartmentCard
            icon="❤️"
            title="Cardiology"
            desc="Heart and cardiovascular care"
          />
          <DepartmentCard
            icon="🧠"
            title="Neurology"
            desc="Brain and nervous system"
          />
          <DepartmentCard
            icon="🦴"
            title="Orthopedics"
            desc="Bone and joint specialists"
          />
          <DepartmentCard
            icon="👶"
            title="Pediatrics"
            desc="Child healthcare"
          />
          <DepartmentCard
            icon="👩‍⚕️"
            title="Gynecology"
            desc="Women's health services"
          />
          <DepartmentCard
            icon="✨"
            title="Dermatology"
            desc="Skin care specialists"
          />
        </div>
      </div>
    </section>
  );
}

/* Card */
function DepartmentCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-50 mb-6 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-sm">
        {desc}
      </p>
    </div>
  );
}
