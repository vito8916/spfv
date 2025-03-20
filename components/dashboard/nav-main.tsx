'use client';

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {LayoutGrid, UserIcon, SettingsIcon} from "lucide-react";
/*
* Main navigation items
*/

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'SPFV Tool',
        url: '/spfv',
        icon: SettingsIcon,
    },
    {
        title: 'Profile',
        url: '/profile',
        icon: UserIcon,
    },
    
];

export function NavMain() {
    const pathname = usePathname();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.title} >
                        <SidebarMenuButton asChild isActive={item.url === pathname}>
                            <Link href={item.url} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
