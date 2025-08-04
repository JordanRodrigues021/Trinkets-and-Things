import { Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { name: "Home", id: "home" },
    { name: "Products", id: "products" },
    { name: "Mystery Boxes", id: "mystery-boxes" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  const services = [
    "Custom Printing",
    "Prototyping", 
    "Design Services",
    "Consultation",
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/trinketsandthings.co.in/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/trinkets-and-things", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-secondary text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Trinkets and Things</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              Transforming ideas into reality through precision 3D printing technology. Creating functional and artistic pieces that inspire and serve.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-300 hover:text-accent transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-300 hover:text-accent transition-colors duration-300 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © 2024 Trinkets and Things. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
