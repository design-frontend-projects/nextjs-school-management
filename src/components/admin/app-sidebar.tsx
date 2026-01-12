"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Calendar, Home, Settings, User } from "lucide-react";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Students",
    url: "/students",
    icon: User,
  },
  {
    title: "Exams",
    url: "/exams",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  // Note: In real app, we need to prefix url with Tenant ID from params or context
  // This component needs to be client-side to read params? Or passed as prop?
  // Using simple approach: relative links work if we are already in /[tenant]/admin
  // But Link href needs absolute path usually or relative to current segment.
  // Ideally we inject the tenant slug. For now hardcoding relative for simplicity or assuming standard Next.js behavior.

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2 text-lg font-bold">Admin Panel</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {/* TODO: Fix Hrefs to be tenant aware: /[tenant]/admin/... */}
                    <Link href={`./${item.url.replace("/", "")}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
