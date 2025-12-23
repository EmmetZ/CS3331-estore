import React from "react";
import NavHeader from "@/components/sidebar/nav_header";
import NavMain from "@/components/sidebar/nav_main";
import NavUser from "@/components/sidebar/nav_user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/auth-context";

const AppSideBar: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser />}</SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
