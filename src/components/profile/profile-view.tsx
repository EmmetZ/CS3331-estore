import React from "react";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import type { User } from "@/types";

interface ProfileViewProps {
  user: User;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  return (
    <FieldSet>
      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel>用户名</FieldLabel>
          <FieldContent>
            <span className="text-foreground text-sm font-medium break-all">
              {user.username}
            </span>
          </FieldContent>
        </Field>

        <Field orientation="responsive">
          <FieldLabel>邮箱</FieldLabel>
          <FieldContent>
            <span className="text-foreground text-sm font-medium break-all">
              {user.email}
            </span>
          </FieldContent>
        </Field>

        <Field orientation="responsive">
          <FieldLabel>电话</FieldLabel>
          <FieldContent>
            <span className="text-foreground text-sm font-medium break-all">
              {user.phone || "-"}
            </span>
          </FieldContent>
        </Field>

        <Field orientation="responsive">
          <FieldLabel>地址</FieldLabel>
          <FieldContent>
            <span className="text-foreground text-sm font-medium break-all">
              {user.address || "-"}
            </span>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
};

export default ProfileView;
