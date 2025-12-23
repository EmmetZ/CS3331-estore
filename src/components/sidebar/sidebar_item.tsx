import { Package, ShoppingCart, User } from "lucide-react";
import type { SideBarItem } from "@/components/sidebar/types";

export const sidebarItems: SideBarItem[] = [
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
  {
    key: "profile",
    title: "我的主页",
    url: "/profile",
    icon: User,
  },
];
