export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: string;
          sale_price: string | null;
          category: string;
          material: string;
          dimensions: string;
          weight: string;
          print_time: string;
          colors: string[];
          disabled_colors: string[];
          images: string[];
          featured: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: string;
          sale_price?: string | null;
          category: string;
          material: string;
          dimensions: string;
          weight: string;
          print_time: string;
          colors: string[];
          disabled_colors?: string[];
          images: string[];
          featured?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: string;
          sale_price?: string | null;
          category?: string;
          material?: string;
          dimensions?: string;
          weight?: string;
          print_time?: string;
          colors?: string[];
          disabled_colors?: string[];
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
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          total_amount: string;
          payment_method: string;
          payment_status: string;
          order_status: string;
          shipping_address: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          total_amount: string;
          payment_method: string;
          payment_status?: string;
          order_status?: string;
          shipping_address?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          total_amount?: string;
          payment_method?: string;
          payment_status?: string;
          order_status?: string;
          shipping_address?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_price: string;
          selected_color: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_price: string;
          selected_color: string;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          product_price?: string;
          selected_color?: string;
          quantity?: number;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}