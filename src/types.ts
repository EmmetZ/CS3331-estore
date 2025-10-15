import { LucideIcon } from "lucide-react";

export interface SideBarItem {
  key: string;
  title: string;
  url: string;
  icon: LucideIcon;
}

// form data interface
export interface ProductFormData {
  product_name: string;
  product_desc: string;
  price: number;
  name: string;
  contact: string;
}

export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  owner_name: string | null;
  owner_contact: string | null;
  created_at: string;
}
