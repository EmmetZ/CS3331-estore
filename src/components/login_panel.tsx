import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks/use-auth";

const LoginPanel: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswd, setShowPasswd] = useState(false);
  const mutation = useLogin();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      username: username.trim(),
      password,
    });
  };

  const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (mutation.error) {
      mutation.reset();
    }
    setUsername(event.target.value);
  };

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (mutation.error) {
      mutation.reset();
    }
    setPassword(event.target.value);
  };

  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 py-6">
      <Card className="w-full max-w-sm py-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-semibold">ESTORE</CardTitle>
          <CardDescription>欢迎回来</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                value={username}
                onChange={updateUsername}
                autoComplete="username"
                placeholder="请输入用户名"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">密码</Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPasswd ? "text" : "password"}
                  value={password}
                  onChange={updatePassword}
                  autoComplete="current-password"
                  placeholder="请输入密码"
                  required
                />
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={showPasswd ? "隐藏密码" : "显示密码"}
                  onClick={() => setShowPasswd((prev) => !prev)}
                >
                  {showPasswd ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </InputGroupButton>
              </InputGroup>
            </div>
            {mutation.error ? (
              <div className="border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-1.5 text-sm">
                {mutation.error.message}
              </div>
            ) : null}
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  正在登录...
                </>
              ) : (
                "登录"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPanel;
