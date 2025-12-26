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
import type { RegisterPayload } from "@/types";

interface RegisterStepOneProps {
  form: Pick<RegisterPayload, "username" | "email">;
  errorMessage: string | null;
  onChange: (partial: Partial<RegisterPayload>) => void;
  onNext: (event: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterStepOne: React.FC<RegisterStepOneProps> = ({
  form,
  errorMessage,
  onChange,
  onNext,
}) => {
  return (
    <form className="space-y-4" onSubmit={onNext}>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="reg-username">用户名</FieldLabel>
          <FieldContent>
            <Input
              id="reg-username"
              name="reg-username"
              value={form.username}
              onChange={(e) => onChange({ username: e.target.value })}
              autoComplete="username"
              placeholder="请输入用户名"
              required
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="reg-email">邮箱</FieldLabel>
          <FieldContent>
            <Input
              id="reg-email"
              name="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => onChange({ email: e.target.value })}
              autoComplete="email"
              placeholder="请输入邮箱"
              required
            />
          </FieldContent>
        </Field>
        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
      </FieldSet>
      <Button type="submit" className="w-full">
        下一步
      </Button>
    </form>
  );
};

export default RegisterStepOne;
