import React from "react";
import { useLocation, useNavigate } from "react-router";
import { SideBarItem } from "@/types";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

interface Props {
  items: SideBarItem[];
}

const NavMain: React.FC<Props> = ({ items }) => {
  const loc = useLocation();
  const navigate = useNavigate();

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
