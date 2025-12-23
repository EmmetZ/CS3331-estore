import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProduct,
  searchProducts,
  updateProduct,
} from "@/service/product";
import { Product, ProductPayload } from "@/types";

const productKeys = {
  all: ["products"] as const,
  list: (keyword: string) => [...productKeys.all, keyword] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
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

export function useProduct(productId: number) {
  const qc = useQueryClient();

  return useQuery<Product, Error>({
    queryKey: productKeys.detail(productId),
    enabled: Number.isFinite(productId) && productId > 0,
    staleTime: 30_000,
    initialData: () => {
      const list = qc.getQueryData<Product[]>(productKeys.list(""));
      return list?.find((item) => item.id === productId);
    },
    queryFn: async () => getProduct(productId),
  });
}

export const productQueryKeys = productKeys;
