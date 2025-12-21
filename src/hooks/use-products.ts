import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  searchProducts,
  updateProduct,
} from "@/service/product";
import { Product, ProductPayload } from "@/types";

const productKeys = {
  all: ["products"] as const,
  list: (keyword: string) => [...productKeys.all, keyword] as const,
};

export function useProducts(keyword: string) {
  return useQuery<Product[], Error>({
    queryKey: productKeys.list(keyword),
    queryFn: () => searchProducts(keyword),
    staleTime: 30_000,
  });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductPayload }) =>
      updateProduct(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export const productQueryKeys = productKeys;
