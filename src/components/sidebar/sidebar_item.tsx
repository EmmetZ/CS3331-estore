import { Package, ShieldCheck, ShoppingCart, User } from "lucide-react";
import type { SideBarItem } from "@/components/sidebar/types";

const baseItems: SideBarItem[] = [
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
  {
    key: "admin",
    title: "管理员",
    url: "/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];

export const getSidebarItems = (isAdmin: boolean | undefined) =>
  baseItems.filter((item) => !item.adminOnly || isAdmin);

export { baseItems as sidebarItems };
