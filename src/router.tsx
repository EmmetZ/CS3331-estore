import { createHashRouter } from "react-router";
import { CartPage } from "@/pages/cart";
import HomePage from "@/pages/home";
import DefaultLayout from "@/pages/layout";
import ProductDetailPage from "@/pages/product_detail";

const router = createHashRouter([
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
    ],
  },
]);

export default router;
