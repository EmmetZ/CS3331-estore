import React from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PartialUser } from "@/types";

interface UsersTabProps {
  data?: PartialUser[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

const UsersTab: React.FC<UsersTabProps> = ({
  data,
  isLoading,
  isError,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive text-sm">{String(error)}</div>;
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="bg-muted text-muted-foreground grid grid-cols-4 px-3 py-2 text-sm font-semibold">
        <span>ID</span>
        <span>用户名</span>
        <span>邮箱</span>
        <span>角色</span>
      </div>
      <Separator />
      <div className="divide-y">
        {data?.map((u) => {
          const isAdmin = u?.is_admin ?? u?.is_admin ?? false;
          return (
            <div
              key={u.id}
              className="grid grid-cols-4 items-center px-3 py-2 text-sm"
            >
              <span className="font-medium">{u.id}</span>
              <span>{u.username}</span>
              <span className="truncate" title={u.email}>
                {u.email}
              </span>
              <span>{isAdmin ? "管理员" : "用户"}</span>
            </div>
          );
        })}
        {data?.length === 0 && (
          <div className="text-muted-foreground px-3 py-4 text-sm">
            暂无用户数据
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
