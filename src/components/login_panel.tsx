import React, { useState } from "react";
import { useNavigate } from "react-router";
import LoginForm from "@/components/auth/login_form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/use-auth";

export default function LoginPanel() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginError = loginMutation.error?.message ?? null;

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-xl">ESTORE</CardTitle>
        <CardDescription>欢迎回来</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm
          username={username}
          password={password}
          showPassword={showPassword}
          errorMessage={loginError}
          isSubmitting={loginMutation.isPending}
          onUsernameChange={(val) => {
            if (loginMutation.error) loginMutation.reset();
            setUsername(val);
          }}
          onPasswordChange={(val) => {
            if (loginMutation.error) loginMutation.reset();
            setPassword(val);
          }}
          onTogglePassword={() => setShowPassword((prev) => !prev)}
          onSubmit={handleLoginSubmit}
        />
        <div className="text-muted-foreground text-center text-sm">
          没有账号？
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-primary ml-1 font-medium hover:underline"
          >
            点击注册
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
