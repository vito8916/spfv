import React from 'react';
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/dashboard/app-sidebar";
import {AppSidebarHeader} from "@/components/dashboard/app-sidebar-header";
import {Suspense} from "react";
import Loading from './loading';

/*
* Layout for the dashboard
*/

const DashboardLayout = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <AppSidebarHeader/>
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;