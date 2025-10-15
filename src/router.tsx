import { createHashRouter } from "react-router";
import { CartPage } from "./pages/cart";
import HomePage from "./pages/home";
import DefaultLayout from "./pages/layout";

const router = createHashRouter([
  {
    path: "/",
    Component: DefaultLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: "cart",
        Component: CartPage,
      },
    ],
  },
]);

export default router;
