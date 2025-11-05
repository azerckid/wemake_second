import { Link, Outlet, useLocation } from "react-router";

import type { Route } from "./+types/dashboard-layout";

import { HomeIcon, PackageIcon, SparklesIcon, BriefcaseIcon } from "lucide-react";
import { getLoggedInUserId, getProductsByUserId } from "../queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "~/common/components/ui/sidebar";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const products = await getProductsByUserId(supabase, { userId });
    return { userId, products };
};

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
    const location = useLocation();
    return (
        <SidebarProvider className="flex  min-h-full">
            <Sidebar className="pt-16" variant="floating">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={location.pathname === "/my/dashboard"}
                                >
                                    <Link to="/my/dashboard">
                                        <HomeIcon className="size-4" />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={location.pathname === "/my/dashboard/ideas"}
                                >
                                    <Link to="/my/dashboard/ideas">
                                        <SparklesIcon className="size-4" />
                                        <span>Ideas</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={location.pathname === "/my/dashboard/jobs"}
                                >
                                    <Link to="/my/dashboard/jobs">
                                        <BriefcaseIcon className="size-4" />
                                        <span>Jobs</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Product Analytics</SidebarGroupLabel>
                        <SidebarMenu>
                            {loaderData.products.map((product) => (
                                <SidebarMenuItem key={product.product_id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            location.pathname ===
                                            `/my/dashboard/products/${product.product_id}`
                                        }
                                    >
                                        <Link to={`/my/dashboard/products/${product.product_id}`}>
                                            <PackageIcon className="size-4" />
                                            <span>{product.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <div className="w-full h-full">
                <Outlet />
            </div>
        </SidebarProvider>
    );
}