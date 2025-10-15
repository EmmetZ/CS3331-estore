import { useLocation } from "react-router";
import { SideBarItem } from "@/types";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

interface Props {
  items: SideBarItem[];
}

export const PageHeader: React.FC<Props> = ({ items }) => {
  const loc = useLocation();
  return (
    <header className="flex h-12 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 gap-0">
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
