import { Package, ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";
import { Outlet } from "react-router";
import AppSideBar from "@/components/app_sidebar";
import { PageHeader } from "@/components/page_header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { initDb } from "@/lib/db";
import { SideBarItem } from "@/types";

const DefaultLayout: React.FC = () => {
  const items: SideBarItem[] = [
    {
      key: "home",
      title: "主页",
      url: "/",
      icon: Package,
    },
    {
      key: "cart",
      title: "购物车",
      url: "/cart",
      icon: ShoppingCart,
    },
  ];

  useEffect(() => {
    initDb();
  }, []);

  return (
    <SidebarProvider>
      <AppSideBar items={items} />
      <SidebarInset>
        <PageHeader items={items} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DefaultLayout;
