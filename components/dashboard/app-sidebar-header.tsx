"use client";

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, 
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";

export function AppSidebarHeader() {
    const pathname = usePathname();
    
    // Generate breadcrumb items based on the current path
    const breadcrumbs = useMemo(() => {
        // Skip the first empty string from the split
        const segments = pathname.split('/').filter(Boolean);
        
        if (segments.length === 0) {
            return [{ label: 'Dashboard', path: '/dashboard', isCurrentPage: true }];
        }
        
        // Create breadcrumb items from path segments
        return segments.map((segment, index) => {
            // Build the path up to this segment
            const path = `/${segments.slice(0, index + 1).join('/')}`;
            
            // Format the segment for display (capitalize, replace hyphens with spaces)
            const label = segment
                .replace(/-/g, ' ')
                .replace(/^\w/, c => c.toUpperCase())
                .replace(/\b\w/g, c => c.toUpperCase());
            
            // Check if this is the current page (last segment)
            const isCurrentPage = index === segments.length - 1;
            
            return { label, path, isCurrentPage };
        });
    }, [pathname]);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {/* Always show Dashboard as the first item */}
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        
                        {/* Show separator if we have breadcrumbs */}
                        {breadcrumbs.length > 0 && (
                            <BreadcrumbSeparator className="hidden md:block" />
                        )}
                        
                        {/* Map through breadcrumb items */}
                        {breadcrumbs.map((breadcrumb, index) => (
                            <BreadcrumbItem key={breadcrumb.path}>
                                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                
                                {breadcrumb.isCurrentPage ? (
                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={breadcrumb.path}>{breadcrumb.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
