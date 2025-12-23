import { Pencil } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import FullScreenError from "@/components/full_screen_error";
import ProfileForm from "@/components/profile/profile-form";
import ProfileView from "@/components/profile/profile-view";
import type {
  ProfileFormErrors,
  ProfileFormState,
} from "@/components/profile/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthContext } from "@/contexts/auth-context";
import { useUpdateProfile } from "@/hooks/use-auth";
import type { User } from "@/types";

const UserProfilePage: React.FC = () => {
  const { user, isLoading, error, refetch } = useAuthContext();
  const updateMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState<ProfileFormState>({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});

  const emailRegex = useMemo(
    () =>
      // Basic email pattern; empty string allowed separately
      /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)*$/i,
    []
  );

  const fillFormFromUser = (currentUser: User | null) => {
    if (!currentUser) return;
    setFormState({
      username: currentUser.username || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
    });
    setFormErrors({});
  };

  const validate = (values: ProfileFormState): ProfileFormErrors => {
    const nextErrors: ProfileFormErrors = {};

    if (!values.username || values.username.trim().length < 3) {
      nextErrors.username = "用户名至少 3 个字符";
    }

    if (values.email && !emailRegex.test(values.email)) {
      nextErrors.email = "邮箱格式不正确";
    }

    if (values.phone && values.phone.length > 30) {
      nextErrors.phone = "电话长度需在 30 字符以内";
    }

    if (values.address && values.address.length > 200) {
      nextErrors.address = "地址长度需在 200 字符以内";
    }

    return nextErrors;
  };

  useEffect(() => {
    fillFormFromUser(user);
  }, [user]);

  const handleFieldChange = (key: keyof ProfileFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    fillFormFromUser(user);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(formState);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await updateMutation.mutateAsync(formState);
      toast.success("信息已更新");
      setIsEditing(false);
    } catch (err) {
      toast.error(`更新失败: ${String(err)}`);
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-4 px-4 pb-6">
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <FullScreenError message={error.message} onRetry={refetch} />;
  }

  if (!user) {
    return (
      <div className="space-y-4 px-4 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>未登录</CardTitle>
            <CardDescription>请先登录以查看个人信息。</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="inline-flex items-baseline gap-2 text-lg font-semibold">
              个人信息
              <span className="text-muted-foreground text-sm">#{user.id}</span>
            </CardTitle>
          </div>
          {!isEditing && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>编辑资料</span>
              </TooltipContent>
            </Tooltip>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <ProfileForm
              formState={formState}
              formErrors={formErrors}
              isSubmitting={updateMutation.isPending}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <ProfileView user={user} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
