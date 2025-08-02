export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: string;
          category: string;
          material: string;
          dimensions: string;
          weight: string;
          print_time: string;
          colors: string[];
          images: string[];
          model_url: string | null;
          featured: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: string;
          category: string;
          material: string;
          dimensions: string;
          weight: string;
          print_time: string;
          colors: string[];
          images: string[];
          model_url?: string | null;
          featured?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: string;
          category?: string;
          material?: string;
          dimensions?: string;
          weight?: string;
          print_time?: string;
          colors?: string[];
          images?: string[];
          featured?: number;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          subject: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          subject: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          subject?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
}