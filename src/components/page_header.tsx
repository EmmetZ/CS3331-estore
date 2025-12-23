import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SideBarItem } from "@/types";

interface Props {
  items: SideBarItem[];
}

export const PageHeader: React.FC<Props> = ({ items }) => {
  const loc = useLocation();
  const navigate = useNavigate();
  const pathname = loc.pathname;
  const isProductDetail = pathname.startsWith("/products/");

  const matched =
    items.find((item) => item.url === pathname) ??
    (pathname.startsWith("/products/")
      ? { title: "商品详情", url: pathname }
      : undefined);

  const title = matched?.title ?? "页面";
  return (
    <header className="flex h-12 shrink-0 items-center gap-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4"
        />
        {isProductDetail && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-base leading-none font-medium">{title}</h1>
      </div>
    </header>
  );
};
