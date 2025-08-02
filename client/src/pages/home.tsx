import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductCategories from "@/components/product-categories";
import ProductGallery from "@/components/product-gallery";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ProductModal from "@/components/product-modal";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <HeroSection />
      <ProductCategories />
      <ProductGallery />
      <AboutSection />
      <ContactSection />
      <Footer />
      <ProductModal />
    </div>
  );
}
