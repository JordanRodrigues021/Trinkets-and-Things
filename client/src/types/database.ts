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
          available_colors: string[];
          disabled_colors: string[];
          is_customizable: number;
          images: string[];
          featured: number;
          customizable: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: string;
          sale_price?: string | null;
          category: string;
          available_colors: string[];
          disabled_colors?: string[];
          is_customizable?: number;
          images: string[];
          featured?: number;
          customizable?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: string;
          sale_price?: string | null;
          category?: string;
          available_colors?: string[];
          disabled_colors?: string[];
          is_customizable?: number;
          images?: string[];
          featured?: number;
          customizable?: number;
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
          subtotal_amount: string;
          discount_amount: string;
          total_amount: string;
          coupon_code: string | null;
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
          subtotal_amount: string;
          discount_amount?: string;
          total_amount: string;
          coupon_code?: string | null;
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
          subtotal_amount?: string;
          discount_amount?: string;
          total_amount?: string;
          coupon_code?: string | null;
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
          custom_name: string | null;
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
          custom_name?: string | null;
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
          custom_name?: string | null;
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
      reviews: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string | null;
          rating: number;
          review_text: string;
          product_purchased: string | null;
          profile_picture_url: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email?: string | null;
          rating: number;
          review_text: string;
          product_purchased?: string | null;
          profile_picture_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string | null;
          rating?: number;
          review_text?: string;
          product_purchased?: string | null;
          profile_picture_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
      };
      banners: {
        Row: {
          id: string;
          title: string;
          description: string;
          button_text: string | null;
          button_link: string | null;
          background_color: string;
          text_color: string;
          is_active: number;
          priority: number;
          start_date: string;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          button_text?: string | null;
          button_link?: string | null;
          background_color?: string;
          text_color?: string;
          is_active?: number;
          priority?: number;
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          button_text?: string | null;
          button_link?: string | null;
          background_color?: string;
          text_color?: string;
          is_active?: number;
          priority?: number;
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          description: string;
          discount_type: string;
          discount_value: string;
          min_order_amount: string | null;
          max_uses: number | null;
          current_uses: number;
          is_active: number;
          start_date: string;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description: string;
          discount_type: string;
          discount_value: string;
          min_order_amount?: string | null;
          max_uses?: number | null;
          current_uses?: number;
          is_active?: number;
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string;
          discount_type?: string;
          discount_value?: string;
          min_order_amount?: string | null;
          max_uses?: number | null;
          current_uses?: number;
          is_active?: number;
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
        };
      };
      custom_sections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: number;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: number;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: number;
          display_order?: number;
          created_at?: string;
        };
      };
      section_products: {
        Row: {
          id: string;
          section_id: string;
          product_id: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          product_id: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          product_id?: string;
          display_order?: number;
          created_at?: string;
        };
      };
    };
  };
}