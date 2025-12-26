import React, { createContext, useContext, useMemo } from "react";
import { useCurrentUser, useLogoutMutation } from "@/hooks/use-auth";
import type { User } from "@/types";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  logout: () => void;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const logoutMutation = useLogoutMutation();

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      error: error ?? null,
      refetch,
      logout: () => logoutMutation.mutate(),
      isLoggingOut: logoutMutation.isPending,
    }),
    [user, isLoading, error, refetch, logoutMutation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};
