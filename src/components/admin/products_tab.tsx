import React from "react";
import { useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";

interface ProductsTabProps {
  data?: Product[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  data,
  isLoading,
  isError,
  error,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive text-sm">{String(error)}</div>;
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="bg-muted text-muted-foreground grid grid-cols-4 px-3 py-2 text-sm font-semibold">
        <span>ID</span>
        <span>名称</span>
        <span>价格</span>
        <span>卖家</span>
      </div>
      <Separator />
      <div className="divide-y">
        {data?.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-4 items-center px-3 py-2 text-left text-sm transition"
          >
            <span className="font-medium">{p.id}</span>
            <span
              className="cursor-pointer truncate hover:underline"
              title={p.name}
              onClick={() => navigate(`/products/${p.id}`)}
            >
              {p.name}
            </span>
            <span className="text-primary font-semibold">
              ¥{(p.price / 100).toFixed(2)}
            </span>
            <span>{p.seller?.username || "-"}</span>
          </div>
        ))}
        {data?.length === 0 && (
          <div className="text-muted-foreground px-3 py-4 text-sm">
            暂无商品数据
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;
