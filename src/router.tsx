import { createHashRouter } from "react-router";
import AdminPage from "@/pages/admin";
import { CartPage } from "@/pages/cart";
import HomePage from "@/pages/home";
import DefaultLayout from "@/pages/layout";
import LoginPage from "@/pages/login";
import ProductDetailPage from "@/pages/product_detail";
import RegisterPage from "@/pages/register";
import UserProfilePage from "@/pages/user_profile";

const router = createHashRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/",
    Component: DefaultLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: "products/:id",
        Component: ProductDetailPage,
      },
      {
        path: "cart",
        Component: CartPage,
      },
      {
        path: "profile",
        Component: UserProfilePage,
      },
      {
        path: "admin",
        Component: AdminPage,
      },
    ],
  },
]);

export default router;
