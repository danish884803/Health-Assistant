import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HospitalMap from "@/components/map/HospitalMap";
import { MapPin } from 'lucide-react';
export default function MapPage() {
    return (
        <main className="main-container">
            <Header />
            <div style={{ paddingTop: 'var(--header-height)' }}>
                <HospitalMap />
            </div>
            <Footer />
        </main>
    );
}
