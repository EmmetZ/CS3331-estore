import React from "react";
import { useLocation, useNavigate } from "react-router";
import { sidebarItems } from "@/components/sidebar/sidebar_item";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NavMain: React.FC = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const items = sidebarItems;

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
