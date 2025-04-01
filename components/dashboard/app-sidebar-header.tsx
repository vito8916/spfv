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
        
        // Special case mapping for familiar paths
        const pathMapping: Record<string, string> = {
            'dashboard': 'Dashboard',
            'spfv': 'Fair Value Tool',
            'profile': 'Profile',
            'analytics': 'Analytics',
            'reports': 'Reports'
        };
        
        if (segments.length === 0) {
            return [{ label: 'Fair Value Dashboard', path: '/dashboard', isCurrentPage: true }];
        }
        
        // Create breadcrumb items from path segments
        return segments.map((segment, index) => {
            // Build the path up to this segment
            const path = `/${segments.slice(0, index + 1).join('/')}`;
            
            // Use mapped name if available
            const label = pathMapping[segment] || segment
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
                                <Link href="/dashboard">Fair Value</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        
                        {/* Show separator if we have breadcrumbs */}
                        {breadcrumbs.length > 0 && (
                            <BreadcrumbSeparator className="hidden md:block" />
                        )}
                        
                        {/* Map through breadcrumb items */}
                        {breadcrumbs.map((breadcrumb, index) => (
                            <div key={breadcrumb.path} className="flex items-center gap-2">
                                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                <BreadcrumbItem>
                                    
                                    
                                {breadcrumb.isCurrentPage ? (
                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={breadcrumb.path}>{breadcrumb.label}</Link>
                                    </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
