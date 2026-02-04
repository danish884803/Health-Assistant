import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HospitalInfo  from "@/components/home/HospitalInfo";
import { MapPin } from 'lucide-react';
export default function Services() {
    return (
        <main className="main-container">
            <Header />
            <div style={{ paddingTop: 'var(--header-height)' }}>
            <HospitalInfo/>
            </div>
            <Footer />
        </main>
    );
}
