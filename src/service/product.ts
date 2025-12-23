import { invoke } from "@tauri-apps/api/core";
import { getErrorMessage } from "@/lib/utils";
import { ApiResponse, Product, ProductPayload } from "@/types";

const ensureData = <T>(resp: ApiResponse<T | null>): T => {
  if (resp.data == null) {
    throw new Error(resp.message || "服务器未返回数据");
  }
  return resp.data;
};

export async function searchProducts(keyword: string): Promise<Product[]> {
  try {
    const trimmed = keyword.trim();
    const resp = await invoke<ApiResponse<Product[] | null>>(
      "search_products",
      {
        keyword: trimmed.length > 0 ? trimmed : null,
      }
    );
    return resp.data ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getProduct(productId: number): Promise<Product> {
  try {
    const resp = await invoke<ApiResponse<Product | null>>("get_product", {
      productId,
    });
    return ensureData(resp);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  try {
    const resp = await invoke<ApiResponse<Product | null>>("create_product", {
      payload,
    });
    return ensureData(resp);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateProduct(
  productId: number,
  payload: ProductPayload
): Promise<Product> {
  try {
    const resp = await invoke<ApiResponse<Product | null>>("update_product", {
      productId: productId,
      payload,
    });
    return ensureData(resp);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  try {
    const resp = await invoke<ApiResponse<null>>("delete_product", {
      // include both keys to match Rust command arg naming (some builds expect camelCase)
      productId: productId,
    });
    if (!resp.success) {
      throw new Error(resp.message || "删除商品失败");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
