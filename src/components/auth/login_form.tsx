import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

interface LoginFormProps {
  username: string;
  password: string;
  showPassword: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  showPassword,
  errorMessage,
  isSubmitting,
  onUsernameChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="login-username">用户名</FieldLabel>
          <FieldContent>
            <Input
              id="login-username"
              name="username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              autoComplete="username"
              placeholder="请输入用户名"
              required
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="login-password">密码</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                autoComplete="current-password"
                placeholder="请输入密码"
                required
              />
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
                onClick={onTogglePassword}
              >
                {showPassword ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </InputGroupButton>
            </InputGroup>
          </FieldContent>
        </Field>

        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
      </FieldSet>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner className="size-4" />
            正在登录...
          </>
        ) : (
          "登录"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
