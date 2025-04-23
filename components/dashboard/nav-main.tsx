"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { type NavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, UserIcon, Calculator, BookOpen } from "lucide-react";
/*
 * Main navigation items
 */

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Fair Value Tools",
    url: "/spfv",
    icon: Calculator,
    items: [
      {
        title: "SP Fair Value",
        url: "/spfv/options",
        icon: Calculator,
      },
      {
        title: "SP Stock Screener",
        url: "/spfv/screener",
        icon: LayoutGrid,
      },
    ],
  },
  {
    title: "Case Studies",
    url: "/case-studies",
    icon: BookOpen,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserIcon,
  },
];

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Fair Value Platform</SidebarGroupLabel>

      <SidebarMenu className="gap-4">
        {mainNavItems.map((item) =>
          item.items ? (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild
                isActive={item.url === pathname}
                className="py-5 px-4 data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild
                isActive={item.url === pathname}
                className="py-5 px-4 data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.url === pathname}
                className="py-5 px-4 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link href={item.url} prefetch>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
