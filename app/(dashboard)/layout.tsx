import React from 'react';
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/dashboard/app-sidebar";
import {AppSidebarHeader} from "@/components/dashboard/app-sidebar-header";
/*
* Layout for the dashboard
*/

const DashboardLayout = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className="w-full overflow-x-hidden">
                <AppSidebarHeader/>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;