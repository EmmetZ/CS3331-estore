import { Search, X } from "lucide-react";
import React, { useRef } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "./ui/button";

interface Props {
  isSearched: boolean;
  isLoading: boolean;
  onSearch: (value: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<Props> = ({
  isSearched,
  onSearch,
  onClear,
  isLoading,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex items-center gap-2">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          ref={ref}
          placeholder="搜索..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearch(ref.current?.value ?? "");
            }
          }}
        />
        {isSearched && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              className="rounded-full"
              size="icon-xs"
              onClick={() => {
                if (ref.current) ref.current.value = "";
                onClear?.();
              }}
            >
              <X className="size-3" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onSearch(ref.current?.value ?? "")}
        disabled={isLoading}
      >
        {isLoading ? <Spinner className="h-4 w-4" /> : <Search />}
      </Button>
    </div>
  );
};

export default SearchBar;
