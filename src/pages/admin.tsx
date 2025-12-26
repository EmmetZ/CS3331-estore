import { Package, RefreshCcw, Users } from "lucide-react";
import React from "react";
import ProductsTab from "@/components/admin/products_tab";
import UsersTab from "@/components/admin/users_tab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/contexts/auth-context";
import { useProducts } from "@/hooks/use-products";
import { useAllUsers } from "@/hooks/use-users";

const AdminPage: React.FC = () => {
  const { user } = useAuthContext();
  const usersQuery = useAllUsers();
  const productsQuery = useProducts("");

  const refresh = () => {
    void Promise.all([usersQuery.refetch(), productsQuery.refetch()]);
  };

  if (!user?.is_admin) {
    return (
      <div className="px-4">
        <Card>
          <CardHeader>
            <CardTitle>无权限</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            只有管理员可以访问该页面。
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">管理员面板</h1>
        <Button variant="ghost" size="sm" onClick={refresh}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          刷新
        </Button>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>数据面板</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users" className="gap-2">
                <Users className="size-4" /> 用户
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Package className="size-4" /> 商品
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-3">
              <UsersTab
                data={usersQuery.data}
                isLoading={usersQuery.isLoading}
                isError={usersQuery.isError}
                error={usersQuery.error}
              />
            </TabsContent>

            <TabsContent value="products" className="space-y-3">
              <ProductsTab
                data={productsQuery.data}
                isLoading={productsQuery.isLoading}
                isError={productsQuery.isError}
                error={productsQuery.error}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
