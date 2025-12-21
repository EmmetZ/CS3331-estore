import React from "react";
import { Outlet } from "react-router";
import AppSideBar from "@/components/app_sidebar";
import { PageHeader } from "@/components/page_header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SideBarItem } from "@/types";

interface Props {
  items: SideBarItem[];
}

const ProtectedAppShell: React.FC<Props> = ({ items }) => {
  return (
    <SidebarProvider>
      <AppSideBar items={items} />
      <SidebarInset>
        <PageHeader items={items} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProtectedAppShell;
