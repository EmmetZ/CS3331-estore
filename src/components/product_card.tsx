import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteProduct } from "@/hooks/use-products";
import { Product } from "@/types";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(product.id);
      toast.success("商品已删除");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("删除失败: " + String(error));
    }
  };

  return (
    <>
      <Card className="group relative flex flex-col gap-2 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10 hover:text-destructive absolute top-2 right-2 h-5 w-5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => setShowDeleteDialog(true)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
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

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除商品 "{product.name}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteMutation.isPending}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
