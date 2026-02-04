import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Features from "@/components/home/Features";
import { MapPin } from 'lucide-react';
export default function Departments() {
    return (
        <main className="main-container">
            <Header />
            <div style={{ paddingTop: 'var(--header-height)' }}>
            <Features/>
            </div>
            <Footer />
        </main>
    );
}
