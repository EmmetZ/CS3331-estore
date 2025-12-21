import React from "react";
import ProductCard from "@/components/product_card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";

const SkeletonCard = () => (
  <div className="space-y-3">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="mt-6 h-8 w-full" />
  </div>
);

const ProductGrid: React.FC<{
  items: Product[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
}> = ({ items = [], isLoading, isError, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (isError)
    return (
      <div className="text-destructive">加载商品失败: {String(error)}</div>
    );

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground">当前没有商品，试试添加一个吧~</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
