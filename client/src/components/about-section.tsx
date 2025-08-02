import { Button } from "@/components/ui/button";

export default function AboutSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "200+", label: "Happy Clients" },
    { number: "15+", label: "Materials Available" },
    { number: "5", label: "Years Experience" },
  ];

  return (
    <section id="about" className="py-8 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-4 sm:mb-6">About Our Studio</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              We are passionate creators who believe in the transformative power of 3D printing technology. Our studio combines artistic vision with technical precision to bring unique designs to life.
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              From functional everyday items to intricate artistic pieces, we push the boundaries of what's possible with additive manufacturing, delivering quality products that exceed expectations.
            </p>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <h3 className="text-xl sm:text-2xl font-bold text-accent mb-1 sm:mb-2">{stat.number}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <Button 
              size="lg"
              onClick={scrollToContact}
              className="bg-primary hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold"
            >
              Get In Touch
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <img 
              src="https://pixabay.com/get/g9e3bfa691a67dfaec98f5e2d1cd859fb33885f7117407687c63eab489449bab4d7832c3e67d86f9f6b31dd3f6c2c5b6550741667a68755d756556ec19221b741_1280.jpg" 
              alt="3D printing workspace" 
              className="rounded-xl shadow-lg col-span-2"
            />
            
            
          </div>
        </div>
      </div>
    </section>
  );
}
