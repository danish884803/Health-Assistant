import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HospitalMap from "@/components/map/HospitalMap";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Header />

      <main className="pt-24">

        <HospitalMap />

      </main>

      <Footer />

    </div>
  );
}