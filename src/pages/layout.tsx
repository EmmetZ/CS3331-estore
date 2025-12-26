import React from "react";
import FullScreenError from "@/components/full_screen_error";
import FullScreenLoader from "@/components/full_screen_loader";
import LoginPanel from "@/components/login_panel";
import ProtectedAppShell from "@/components/protected_app_shell";
import { Toaster } from "@/components/ui/sonner";
import { useAuthContext } from "@/contexts/auth-context";

const DefaultLayout: React.FC = () => {
  const { user, isLoading, error, refetch } = useAuthContext();

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <FullScreenLoader />;
  } else if (error) {
    content = (
      <FullScreenError
        message={error.message}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  } else if (!user) {
    content = (
      <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 py-6">
        <LoginPanel />
      </div>
    );
  } else {
    content = <ProtectedAppShell />;
  }

  return (
    <>
      {content}
      <Toaster />
    </>
  );
};
export default DefaultLayout;
