import { type User, type InsertUser, type Product, type InsertProduct, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.contacts = new Map();
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Geometric Lattice Vase",
        description: "Modern decorative vase with intricate geometric patterns that create beautiful shadow play when lit. Perfect for both functional use and decorative display.",
        price: "45.00",
        category: "artistic",
        material: "PLA+",
        dimensions: "15cm × 15cm × 20cm",
        weight: "250g",
        printTime: "8 hours",
        colors: ["White", "Black", "Blue", "Red"],
        images: [
          "https://pixabay.com/get/g91df56c451c16430f30821c54b2eebab574cb7f869eec3915326c0f78e0320f27d3bb7e65df398bd69a3e9d059314764a2f97e92f96d1d36c6844b4c58158f9b_1280.jpg",
          "https://images.unsplash.com/photo-1583692647055-5d3e37d6b36a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        featured: 1,
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Ergonomic Phone Stand",
        description: "Adjustable stand for optimal viewing angles with sleek modern design that complements any workspace.",
        price: "25.00",
        category: "functional",
        material: "PETG",
        dimensions: "12cm × 8cm × 10cm",
        weight: "150g",
        printTime: "4 hours",
        colors: ["Black", "White", "Gray"],
        images: [
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1583692647055-5d3e37d6b36a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        featured: 0,
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Flow Sculpture",
        description: "Abstract art piece with organic flowing forms that captures movement in static material.",
        price: "85.00",
        category: "artistic",
        material: "PLA",
        dimensions: "20cm × 15cm × 25cm",
        weight: "400g",
        printTime: "12 hours",
        colors: ["White", "Gold", "Silver"],
        images: [
          "https://pixabay.com/get/g7eb5694e2468ac83eb39631519459ee81a0fbd0bc6aeccddc9aa475dd614d79ac6d93a42a7e6ed9993ee0c180dcc128a3c17630a1eac2d7b25c455d9bca72270_1280.jpg"
        ],
        featured: 0,
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Modular Desk Organizer",
        description: "Customizable compartments for office supplies with modular design that adapts to your needs.",
        price: "35.00",
        category: "functional",
        material: "PLA+",
        dimensions: "25cm × 15cm × 8cm",
        weight: "300g",
        printTime: "6 hours",
        colors: ["Black", "White", "Blue", "Green"],
        images: [
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        featured: 2,
        createdAt: new Date(),
      },
      {
        id: "5",
        name: "Custom Figurine",
        description: "Highly detailed collectible figurine with intricate features and premium finish.",
        price: "65.00",
        category: "artistic",
        material: "Resin",
        dimensions: "10cm × 8cm × 15cm",
        weight: "200g",
        printTime: "10 hours",
        colors: ["Natural", "Painted"],
        images: [
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        featured: 0,
        createdAt: new Date(),
      },
      {
        id: "6",
        name: "Geometric Lamp Shade",
        description: "Modern lighting with unique shadow patterns that transform any space with ambient lighting.",
        price: "55.00",
        category: "functional",
        material: "PLA",
        dimensions: "30cm × 30cm × 35cm",
        weight: "500g",
        printTime: "14 hours",
        colors: ["White", "Black", "Translucent"],
        images: [
          "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        featured: 0,
        createdAt: new Date(),
      },
      {
        id: "7",
        name: "Architectural Model",
        description: "Precise scale model for presentations with detailed structural elements and professional finish.",
        price: "120.00",
        category: "prototypes",
        material: "ABS",
        dimensions: "40cm × 30cm × 20cm",
        weight: "800g",
        printTime: "20 hours",
        colors: ["White", "Gray"],
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        featured: 0,
        createdAt: new Date(),
      },
      {
        id: "8",
        name: "Kitchen Organizer",
        description: "Multi-compartment utensil storage solution that maximizes kitchen drawer space efficiency.",
        price: "40.00",
        category: "functional",
        material: "PETG",
        dimensions: "35cm × 25cm × 6cm",
        weight: "450g",
        printTime: "8 hours",
        colors: ["White", "Black", "Gray"],
        images: [
          "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        featured: 0,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values())
      .filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
