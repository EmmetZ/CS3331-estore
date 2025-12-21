import React from "react";
import NavHeader from "@/components/nav_header";
import NavMain from "@/components/nav_main";
import NavUser from "@/components/nav_user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/auth-context";
import { SideBarItem } from "@/types";

interface Props {
  items: SideBarItem[];
}

const AppSideBar: React.FC<Props> = ({ items }) => {
  const { user, logout, isLoggingOut } = useAuthContext();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser />}</SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
