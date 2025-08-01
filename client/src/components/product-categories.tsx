export default function ProductCategories() {
  const categories = [
    {
      id: 'functional',
      name: 'Functional Items',
      description: 'Tools, organizers, and practical solutions',
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
    },
    {
      id: 'artistic',
      name: 'Artistic Pieces',
      description: 'Sculptures, decorations, and unique designs',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
    },
    {
      id: 'prototypes',
      name: 'Prototypes',
      description: 'Professional models and concept pieces',
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
    }
  ];

  const filterByCategory = (category: string) => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event to filter products
      window.dispatchEvent(new CustomEvent('filterCategory', { detail: category }));
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Product Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of 3D printed products, each crafted with precision and attention to detail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="group cursor-pointer"
              onClick={() => filterByCategory(category.id)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-200">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
