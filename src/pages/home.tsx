import { RefreshCcw } from "lucide-react";
import React, { useState } from "react";
import AddButton from "@/components/add_button";
import ProductGrid from "@/components/product_grid";
import SearchBar from "@/components/search_bar";
import { Button } from "@/components/ui/button";
import { useProducts, useRefreshProducts } from "@/hooks/use-products";

const HomePage: React.FC = () => {
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, error } = useProducts(query);

  const doSearch = (value: string) => setQuery(value.trim());
  const clearSearch = () => setQuery("");
  const refresh = useRefreshProducts();

  return (
    <div className="px-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="group flex items-center gap-2">
          <h1 className="text-xl font-semibold">商品列表</h1>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100"
            onClick={refresh}
          >
            <RefreshCcw className="size-4" />
          </Button>
        </div>
        <div className="w-full sm:w-1/3">
          <SearchBar
            isSearched={query !== ""}
            onSearch={doSearch}
            onClear={clearSearch}
            isLoading={isLoading}
          />
        </div>
      </div>
      <ProductGrid
        items={Array.isArray(data) ? data : []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <AddButton />
    </div>
  );
};

export default HomePage;
