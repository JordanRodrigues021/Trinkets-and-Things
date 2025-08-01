import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

interface UseProductsOptions {
  category?: string;
  search?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const queryParams = new URLSearchParams();
  
  if (options.category) {
    queryParams.append('category', options.category);
  }
  
  if (options.search) {
    queryParams.append('search', options.search);
  }

  const queryString = queryParams.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ''}`;

  return useQuery<Product[]>({
    queryKey: ['/api/products', options.category, options.search],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
  });
}
