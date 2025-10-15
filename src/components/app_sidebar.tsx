import React from "react";
import { SideBarItem } from "@/types";
import NavHeader from "./nav_header";
import NavMain from "./nav_main";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";

interface Props {
  items: SideBarItem[];
}

const AppSideBar: React.FC<Props> = ({ items }) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
    </Sidebar>
  );
};

export default AppSideBar;
