import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

export const Route = createFileRoute("/_authenticated/dashboard")({
    component: DashboardLayout,
});

function DashboardLayout() {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex h-12 items-center border-b border-border/60 px-2">
                        <SidebarTrigger />
                    </div>
                    <main className="flex-1 min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
