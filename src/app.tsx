import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { RouterProvider } from "react-router";
import router from "./router";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
