import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { PageHeader } from "@/components/page_header";
import AppSideBar from "@/components/sidebar/app_sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/auth-context";

const ProtectedAppShell: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.is_admin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }, []);

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
