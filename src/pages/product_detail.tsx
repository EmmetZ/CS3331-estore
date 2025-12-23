import React from "react";
import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/use-products";

const PriceTag: React.FC<{ value: number }> = ({ value }) => (
  <span className="text-primary text-2xl font-bold">
    ¥{(value / 100).toFixed(2)}
  </span>
);

type SellerItem = { label: string; value: string };

const SellerInfo: React.FC<{ items: SellerItem[] }> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <>
      <div className="text-muted-foreground space-y-1 text-sm">
        <div className="text-foreground font-semibold">卖家信息</div>
        {items.map((item) => (
          <div key={item.label}>
            {item.label}：{item.value}
          </div>
        ))}
      </div>
    </>
  );
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const productId = Number(id);
  const { data, isLoading, isError, error } = useProduct(productId);

  const invalidId = !id || Number.isNaN(productId);

  if (invalidId) {
    return (
      <div className="space-y-4 px-4 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>无法加载</CardTitle>
            <CardDescription>商品 ID 无效。</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 px-4 pb-6">
        <Card className="space-y-4">
          <CardHeader className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Separator />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 px-4 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>加载失败</CardTitle>
            <CardDescription className="text-destructive">
              {String(error)}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4 px-4 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>未找到商品</CardTitle>
            <CardDescription>该商品可能已被删除。</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const sellerItems: SellerItem[] = [];
  const seller = data.seller;

  if (seller?.username?.trim())
    sellerItems.push({ label: "名称", value: seller.username.trim() });
  if (seller?.email?.trim())
    sellerItems.push({ label: "邮箱", value: seller.email.trim() });
  if (seller?.phone?.trim())
    sellerItems.push({ label: "电话", value: seller.phone.trim() });
  if (seller?.address?.trim())
    sellerItems.push({ label: "地址", value: seller.address.trim() });

  return (
    <div className="space-y-4 px-4 pb-6">
      <Card className="space-y-2">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center justify-between gap-4">
            <span className="inline-flex items-baseline gap-2 text-lg leading-tight font-semibold">
              <span>{data.name}</span>
              <span className="text-muted-foreground text-sm">#{data.id}</span>
            </span>
            <PriceTag value={data.price} />
          </CardTitle>
          <CardDescription>
            <div className="text-primary">{data.description || "暂无描述"}</div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Separator />
          <SellerInfo items={sellerItems} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
