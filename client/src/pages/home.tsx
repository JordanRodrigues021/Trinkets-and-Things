import Navigation from "@/components/navigation";
import PromotionalBanner from "@/components/promotional-banner";
import HeroSection from "@/components/hero-section";
import SectionsDisplay from "@/components/sections-display";
import MysteryBoxes from "@/components/mystery-boxes";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ProductModal from "@/components/product-modal";
import ReviewsCarousel from "@/components/reviews-carousel";
import ReviewLinkBanner from "@/components/review-link-banner";
import InstagramSection from "@/components/instagram-section";
import { Star, Package } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PromotionalBanner />
      <Navigation />
      <HeroSection />
      
      {/* Customer Reviews Section - Moved up for better social proof */}
      <section id="reviews" className="py-8 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-current" />
              Customer Reviews
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by 500+ Happy Customers
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
              Join thousands of satisfied customers who trust us for premium 3D printed products. See what they're saying!
            </p>
          </div>
          <ReviewsCarousel />
          
          {/* Review Link Banner */}
          <div className="mt-8">
            <ReviewLinkBanner />
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-green-600 fill-current" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">500+</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Happy Customers</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">1000+</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Products Created</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">99%</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Quality Guarantee</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">24/7</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Fast Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-8 sm:py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              Our Products
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Our Premium Collection
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base mb-6">
              Discover high-quality 3D printed products crafted with precision and care. From functional items to artistic masterpieces.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Free shipping on orders above ₹999
            </div>
          </div>
          <SectionsDisplay />
        </div>
      </section>

      {/* Mystery Boxes Section */}
      <MysteryBoxes />

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
