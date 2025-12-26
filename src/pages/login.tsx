import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import LoginPanel from "@/components/login_panel";
import { useAuthContext } from "@/contexts/auth-context";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 py-6">
      <LoginPanel />
    </div>
  );
};

export default LoginPage;
