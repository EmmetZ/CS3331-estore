import React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ProfileFormErrors, ProfileFormState } from "./types";

interface ProfileFormProps {
  formState: ProfileFormState;
  formErrors: ProfileFormErrors;
  isSubmitting: boolean;
  onChange: (key: keyof ProfileFormState, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formState,
  formErrors,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FieldSet>
        <FieldGroup>
          <Field orientation="responsive" data-invalid={!!formErrors.username}>
            <FieldLabel htmlFor="username">用户名</FieldLabel>
            <FieldContent>
              <Input
                id="username"
                value={formState.username}
                onChange={(e) => onChange("username", e.target.value)}
              />
              <FieldError
                errors={
                  formErrors.username
                    ? [{ message: formErrors.username }]
                    : undefined
                }
              />
            </FieldContent>
          </Field>

          <Field orientation="responsive" data-invalid={!!formErrors.email}>
            <FieldLabel htmlFor="email">邮箱</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
              <FieldError
                errors={
                  formErrors.email ? [{ message: formErrors.email }] : undefined
                }
              />
            </FieldContent>
          </Field>

          <Field orientation="responsive" data-invalid={!!formErrors.phone}>
            <FieldLabel htmlFor="phone">电话</FieldLabel>
            <FieldContent>
              <Input
                id="phone"
                value={formState.phone || ""}
                onChange={(e) => onChange("phone", e.target.value)}
              />
              <FieldError
                errors={
                  formErrors.phone ? [{ message: formErrors.phone }] : undefined
                }
              />
            </FieldContent>
          </Field>

          <Field orientation="responsive" data-invalid={!!formErrors.address}>
            <FieldLabel htmlFor="address">地址</FieldLabel>
            <FieldContent>
              <Input
                id="address"
                value={formState.address || ""}
                onChange={(e) => onChange("address", e.target.value)}
              />
              <FieldError
                errors={
                  formErrors.address
                    ? [{ message: formErrors.address }]
                    : undefined
                }
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
