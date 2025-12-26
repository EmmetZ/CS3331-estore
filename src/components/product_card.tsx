import type React from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/types";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();

  const goDetail = () => navigate(`/products/${product.id}`);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goDetail();
    }
  };

  return (
    <Card
      className="group relative flex cursor-pointer flex-col gap-2 overflow-hidden"
      onClick={goDetail}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <CardHeader className="flex-1">
        <CardTitle className="flex items-center justify-between">
          <span className="truncate text-base font-semibold">
            {product.name}
          </span>
        </CardTitle>
        <CardDescription className="items-start overflow-auto">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {product.description || "暂无描述"}
          </p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex content-center items-center justify-between">
        <span className="text-primary shrink-0 text-lg font-bold">
          ¥{(product.price / 100).toFixed(2)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
