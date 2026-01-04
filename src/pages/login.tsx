import React from "react";
import LoginPanel from "@/components/login_panel";

const LoginPage: React.FC = () => {
  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 py-6">
      <LoginPanel />
    </div>
  );
};

export default LoginPage;
