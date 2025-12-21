import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAddProduct } from "@/hooks/use-products";
import { ProductFormData, ProductPayload } from "@/types";

// mark component for required fields
const RequiredMark = () => <span className="text-red-500">*</span>;

interface Props {
  className?: string;
}

const AddButton: React.FC<Props> = ({ className }) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
  });

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const mutation = useAddProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // required field validation
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error("请填写所有必填字段，价格必须大于0");
      return;
    }

    const payload: ProductPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Math.round(formData.price * 100),
    };

    if (!payload.name || !payload.description || payload.price <= 0) {
      toast.error("请输入合法的商品信息");
      return;
    }

    setIsLoading(true);

    try {
      await mutation.mutateAsync(payload);

      // reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
      });

      setOpen(false);
      toast.success("商品添加成功");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("添加商品失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
    });
    setOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加商品</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">
                    商品名称 <RequiredMark />
                  </FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="请输入商品名称"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="price">
                    价格 (元) <RequiredMark />
                  </FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        Number.isNaN(parseFloat(e.target.value))
                          ? 0
                          : parseFloat(e.target.value)
                      )
                    }
                    placeholder="请输入价格"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">
                    商品描述 <RequiredMark />
                  </FieldLabel>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="请输入商品描述"
                    required
                    className="min-h-24"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner />}
                确定
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                取消
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            className={`fixed right-6 bottom-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${className || ""}`}
            onClick={() => setOpen(true)}
            aria-label="添加商品"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>添加商品</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default AddButton;
