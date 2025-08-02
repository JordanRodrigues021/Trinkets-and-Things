import { useMemo } from "react";
import { getProducts, getProduct } from "@/data/products";
import type { Product } from "@shared/schema";

interface UseProductsOptions {
  category?: string;
  search?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const products = useMemo(() => {
    return getProducts(options);
  }, [options.category, options.search]);

  return {
    data: products,
    isLoading: false,
    error: null,
  };
}

export function useProduct(id: string) {
  const product = useMemo(() => {
    return getProduct(id);
  }, [id]);

  return {
    data: product,
    isLoading: false,
    error: product ? null : new Error('Product not found'),
  };
}
