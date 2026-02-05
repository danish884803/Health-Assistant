import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Chatbot from "@/components/chat/Chatbot";
import HospitalMap from "@/components/map/HospitalMap";
import HospitalInfo from "@/components/home/HospitalInfo";
export default function Home() {
  return (
<main className="w-full overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <HospitalInfo/>
      {/* <HospitalMap /> */}
      <Chatbot />
      <Footer />
    </main>
  );
}
