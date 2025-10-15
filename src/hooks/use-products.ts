import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProduct,
  deleteProduct,
  getProducts,
  searchProducts,
} from "@/lib/db";
import { ProductFormData } from "@/types";
import { Product } from "@/types";

export function useProducts(query?: string) {
  const key = ["products", query ?? ""] as const;
  return useQuery<Product[], Error>({
    queryKey: key,
    queryFn: async () => {
      if (query && query.length > 0) {
        const res = await searchProducts(query);
        return res as Product[];
      }

      const res = await getProducts();
      return res as Product[];
    },
  });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductFormData) => addProduct(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useRefreshProducts() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["products"] });
}
