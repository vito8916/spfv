import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import AppLogo from "@/components/app-logo";
import Link from "next/link";
import {NavMain} from "@/components/dashboard/nav-main";
import {NavUser} from "@/components/dashboard/nav-user";
import { createClient } from '@/utils/supabase/server';

export async function AppSidebar() {
    const supabase = await createClient();   
    //get the user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const userInfo = {
        name: user.user_metadata.full_name,
        email: user.email || "",
        avatar: user.user_metadata.avatar,
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar"> {/* You can change the variant to "sidebar" or "inset" */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain  />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userInfo} />
            </SidebarFooter>
        </Sidebar>
    );
}
