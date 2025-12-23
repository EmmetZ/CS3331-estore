import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, login, logout, updateUser } from "@/service/user";
import { LoginPayload, UpdateUserPayload, User } from "@/types";

const authKeys = {
  current: ["current-user"] as const,
};

export function useCurrentUser() {
  return useQuery<User | null, Error>({
    queryKey: authKeys.current,
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: authKeys.current });
    },
  });
}

export function useLogoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      qc.clear();
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    onSuccess: async (user) => {
      qc.setQueryData(authKeys.current, user);
      await qc.invalidateQueries({ queryKey: authKeys.current });
    },
  });
}

export const authQueryKeys = authKeys;
