import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UseProductsOptions {
  category?: string;
  search?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  sale_price: string | null;
  category: string;
  colors: string[];
  disabled_colors: string[];
  images: string[];
  featured: number;
  customizable: number;
  createdAt: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (options.category) {
          query = query.eq('category', options.category);
        }

        if (options.search) {
          query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%,category.ilike.%${options.search}%`);
        }

        const { data: products, error } = await query;

        if (error) throw error;

        const transformedProducts: Product[] = (products || []).map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          sale_price: product.sale_price,
          category: product.category,
          colors: product.colors || [],
          disabled_colors: product.disabled_colors || [],
          images: product.images || [],
          featured: product.featured || 0,
          customizable: product.customizable || 0,
          createdAt: product.created_at,
        }));

        setData(transformedProducts);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [options.category, options.search]);

  return { data, isLoading, error };
}

export function useProduct(id: string) {
  const [data, setData] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (product) {
          const transformedProduct: Product = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            sale_price: product.sale_price,
            category: product.category,
            colors: product.colors || [],
            disabled_colors: product.disabled_colors || [],
            images: product.images || [],
            featured: product.featured || 0,
            customizable: product.customizable || 0,
            createdAt: product.created_at,
          };
          setData(transformedProduct);
        } else {
          setData(undefined);
        }
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { data, isLoading, error };
}
