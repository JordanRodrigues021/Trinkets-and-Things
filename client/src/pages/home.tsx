import Navigation from "@/components/navigation";
import PromotionalBanner from "@/components/promotional-banner";
import HeroSection from "@/components/hero-section";
import ProductGallery from "@/components/product-gallery";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ProductModal from "@/components/product-modal";
import ReviewsCarousel from "@/components/reviews-carousel";
import ReviewLinkBanner from "@/components/review-link-banner";
import InstagramSection from "@/components/instagram-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PromotionalBanner />
      <Navigation />
      <HeroSection />
      
      {/* Second promotional banner before products */}
      <PromotionalBanner />
      <ProductGallery />
      
      {/* Customer Reviews Section */}
      <section id="reviews" className="py-8 sm:py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
              Real feedback from satisfied customers who love our 3D printed products.
            </p>
          </div>
          <ReviewsCarousel />
          
          {/* Review Link Banner */}
          <div className="mt-8">
            <ReviewLinkBanner />
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-8 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstagramSection />
        </div>
      </section>

      <AboutSection />
      <ContactSection />
      <Footer />
      <ProductModal />
    </div>
  );
}
