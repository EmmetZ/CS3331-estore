import { LucideIcon } from "lucide-react";

export interface SideBarItem {
  key: string;
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  phone: string;
  address: string;
}

// form data interface
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  seller?: Seller;
}

export interface Seller {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  is_admin: boolean;
}
