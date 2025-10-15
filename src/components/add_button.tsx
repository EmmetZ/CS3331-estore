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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAddProduct } from "@/hooks/use-products";
import { ProductFormData } from "@/types";

// mark component for required fields
const RequiredMark = () => <span className="text-red-500">*</span>;

interface Props {
  className?: string;
}

const AddButton: React.FC<Props> = ({ className }) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    product_desc: "",
    price: 0,
    name: "",
    contact: "",
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
    if (
      !formData.product_name ||
      !formData.product_desc ||
      formData.price <= 0 ||
      !formData.name ||
      !formData.contact
    ) {
      toast.error("请填写所有必填字段，价格必须大于0");
      return;
    }

    setIsLoading(true);

    try {
      await mutation.mutateAsync(formData);

      // reset form
      setFormData({
        product_name: "",
        product_desc: "",
        price: 0,
        name: "",
        contact: "",
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
      product_name: "",
      product_desc: "",
      price: 0,
      name: "",
      contact: "",
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
                  <FieldLabel htmlFor="product_name">
                    商品名称 <RequiredMark />
                  </FieldLabel>
                  <Input
                    id="product_name"
                    type="text"
                    value={formData.product_name}
                    onChange={(e) =>
                      handleInputChange("product_name", e.target.value)
                    }
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
                      handleInputChange("price", parseFloat(e.target.value))
                    }
                    placeholder="请输入价格"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="product_desc">
                    商品描述 <RequiredMark />
                  </FieldLabel>
                  <Textarea
                    id="product_desc"
                    value={formData.product_desc}
                    onChange={(e) =>
                      handleInputChange("product_desc", e.target.value)
                    }
                    placeholder="请输入商品描述"
                    required
                    className="min-h-24"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator className="my-2" />
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">
                    姓名 <RequiredMark />
                  </FieldLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="请输入您的姓名"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact">
                    联系方式 <RequiredMark />
                  </FieldLabel>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) =>
                      handleInputChange("contact", e.target.value)
                    }
                    placeholder="请输入联系方式"
                    required
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
