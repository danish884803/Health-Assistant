import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1f2d35] text-gray-300">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-16">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center text-white font-bold">
              SK
            </div>
            <div>
              <p className="font-semibold text-white leading-tight">
                Sheikh Khalifa Hospital
              </p>
              <p className="text-sm text-gray-400">Fujairah</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Providing exceptional healthcare services with compassion and
            innovation. Your health is our priority.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-5">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/departments">Departments</Link></li>
            <li><Link href="/map">Hospital Map</Link></li>
            <li><Link href="/login">Login</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-5">
            Contact Us
          </h4>
          <div className="space-y-3 text-sm text-gray-400">
            <p>Phone: +971 9 XXX XXXX</p>
            <p>Email: info@skh-fujairah.ae</p>
            <p>Sheikh Khalifa Hospital, Fujairah, UAE</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
          <p>
            © 2024 Sheikh Khalifa Hospital - Fujairah. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
