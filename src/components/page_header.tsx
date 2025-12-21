import { useLocation } from "react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SideBarItem } from "@/types";

interface Props {
  items: SideBarItem[];
}

export const PageHeader: React.FC<Props> = ({ items }) => {
  const loc = useLocation();
  return (
    <header className="flex h-12 shrink-0 items-center gap-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {items.filter((item) => item.url === loc.pathname)[0].title}
        </h1>
      </div>
    </header>
  );
};
