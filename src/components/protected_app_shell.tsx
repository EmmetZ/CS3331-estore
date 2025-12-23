import React from "react";
import { Outlet } from "react-router";
import { PageHeader } from "@/components/page_header";
import AppSideBar from "@/components/sidebar/app_sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const ProtectedAppShell: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset>
        <PageHeader />
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
