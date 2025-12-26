import React from "react";
import { useLocation, useNavigate } from "react-router";
import { getSidebarItems } from "@/components/sidebar/sidebar_item";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/auth-context";

const NavMain: React.FC = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const items = getSidebarItems(user?.is_admin);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="gap-1.5">
          {items.map((item) => (
            <SidebarMenuItem className="flex items-center gap-2" key={item.key}>
              <SidebarMenuButton
                className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground cursor-pointer"
                tooltip={item.title}
                isActive={loc.pathname === item.url}
                onClick={() => navigate(item.url)}
              >
                <item.icon className="size-4" />
                <span className="font-semibold">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavMain;
