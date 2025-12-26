import type { LucideIcon } from "lucide-react";

export interface SideBarItem {
  key: string;
  title: string;
  url: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}
