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
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

interface RegisterStepTwoProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirm: boolean;
  passwordsMatch: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const RegisterStepTwo: React.FC<RegisterStepTwoProps> = ({
  password,
  confirmPassword,
  showPassword,
  showConfirm,
  passwordsMatch,
  errorMessage,
  isSubmitting,
  onPasswordChange,
  onConfirmChange,
  onTogglePassword,
  onToggleConfirm,
  onSubmit,
  onBack,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="reg-password">密码</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="reg-password"
                name="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                autoComplete="new-password"
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

        <Field data-invalid={!passwordsMatch && confirmPassword.length > 0}>
          <FieldLabel htmlFor="reg-confirm">确认密码</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="reg-confirm"
                name="reg-confirm"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => onConfirmChange(e.target.value)}
                autoComplete="new-password"
                placeholder="请再次输入密码"
                required
              />
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={showConfirm ? "隐藏密码" : "显示密码"}
                onClick={onToggleConfirm}
              >
                {showConfirm ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </InputGroupButton>
            </InputGroup>
          </FieldContent>
          {!passwordsMatch && confirmPassword.length > 0 ? (
            <FieldError>两次密码不一致</FieldError>
          ) : null}
        </Field>

        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
      </FieldSet>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-1/3"
          onClick={onBack}
        >
          上一步
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="size-4" />
              正在注册...
            </>
          ) : (
            "注册"
          )}
        </Button>
      </div>
    </form>
  );
};

export default RegisterStepTwo;
