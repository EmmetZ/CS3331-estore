import { Package, ShoppingCart } from "lucide-react";
import React from "react";
import FullScreenError from "@/components/full_screen_error";
import FullScreenLoader from "@/components/full_screen_loader";
import LoginPanel from "@/components/login_panel";
import ProtectedAppShell from "@/components/protected_app_shell";
import { Toaster } from "@/components/ui/sonner";
import { useAuthContext } from "@/contexts/auth-context";
import { SideBarItem } from "@/types";

const sidebarItems: SideBarItem[] = [
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

const DefaultLayout: React.FC = () => {
  const { user, isLoading, error, refetch } = useAuthContext();

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <FullScreenLoader />;
  } else if (error) {
    content = (
      <FullScreenError
        message={error.message}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  } else if (!user) {
    content = <LoginPanel />;
  } else {
    content = <ProtectedAppShell items={sidebarItems} />;
  }

  return (
    <>
      {content}
      <Toaster />
    </>
  );
};
export default DefaultLayout;
