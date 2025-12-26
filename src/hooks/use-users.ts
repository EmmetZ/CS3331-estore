import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/service/user";
import { PartialUser } from "@/types";

const userKeys = {
  all: ["admin-users"] as const,
};

export function useAllUsers() {
  return useQuery<PartialUser[], Error>({
    queryKey: userKeys.all,
    queryFn: getAllUsers,
    staleTime: 30_000,
  });
}

export const adminUserKeys = userKeys;
