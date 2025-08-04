import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, ShoppingCart, MessageSquare, Package } from "lucide-react";
import CartSidebar from './cart-sidebar';
import ReviewForm from './review-form';
import OrderTracking from './order-tracking';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      scrollToSection('products');
      // The search will be handled by the ProductGallery component
      window.dispatchEvent(new CustomEvent('search', { detail: searchQuery }));
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img 
                  src="https://i.ibb.co/21pXCY9j/Trinkets-and-Things-Logo-circle.png" 
                  alt="Trinkets and Things Logo" 
                  className="w-8 h-8 rounded-lg"
                />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-secondary hidden sm:block">Trinkets and Things</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Products
            </button>
            <button 
              onClick={() => scrollToSection('mystery-boxes')}
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Mystery Boxes
            </button>
            <button 
              onClick={() => scrollToSection('reviews')}
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Reviews
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </form>
            <OrderTracking>
              <Button variant="ghost" size="icon" title="Track Order">
                <Package className="h-5 w-5" />
              </Button>
            </OrderTracking>
            <ReviewForm>
              <Button variant="ghost" size="icon" title="Leave Review">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </ReviewForm>
            <CartSidebar>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </CartSidebar>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-gray-700 hover:text-primary transition-colors duration-300"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className="text-left text-gray-700 hover:text-primary transition-colors duration-300"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection('mystery-boxes')}
                className="text-left text-gray-700 hover:text-primary transition-colors duration-300"
              >
                Mystery Boxes
              </button>
              <button 
                onClick={() => scrollToSection('reviews')}
                className="text-left text-gray-700 hover:text-primary transition-colors duration-300"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-700 hover:text-primary transition-colors duration-300"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-primary transition-colors duration-300"
              >
                Contact
              </button>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
