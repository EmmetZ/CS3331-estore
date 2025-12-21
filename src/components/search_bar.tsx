import { Search, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  isSearched: boolean;
  isLoading: boolean;
  value?: string;
  onSearch: (value: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<Props> = ({
  isSearched,
  onSearch,
  onClear,
  isLoading,
  value,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = value ?? "";
    }
  }, [value]);

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
