import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PackagesSection from "@/components/PackagesSection";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <PackagesSection />
      <Gallery />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
