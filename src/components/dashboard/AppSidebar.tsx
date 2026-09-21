import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
    LayoutDashboard, Briefcase, FileText, User, LogOut, GraduationCap, Bell,
} from "lucide-react";
import { getUser, signOut as clearSession, type User } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const studentItems = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard, exact: true },
    { title: "Browse Jobs", url: "/dashboard/jobs", icon: Briefcase },
    { title: "My Applications", url: "/dashboard/applications", icon: FileText },
    { title: "Profile", url: "/dashboard/profile", icon: User },
];
const recruiterItems = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard, exact: true },
    { title: "Recruiter workspace", url: "/dashboard/recruiter", icon: Briefcase },
];

export function AppSidebar() {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => { getUser().then(setUser); }, []);
    const items = user?.role === "recruiter" ? recruiterItems : studentItems;

    const isActive = (url: string, exact?: boolean) =>
        exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

    const signOut = async () => {
        await qc.cancelQueries();
        qc.clear();
        await clearSession();
        toast.success("Signed out");
        navigate({ to: "/auth", replace: true });
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-2 py-1">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="leading-tight">
                            <div className="text-sm font-bold">Campus Placement</div>
                            <div className="text-[10px] text-muted-foreground -mt-0.5">{user?.role === "recruiter" ? "RECRUITER PORTAL" : "STUDENT PORTAL"}</div>
                        </div>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((it) => (
                                <SidebarMenuItem key={it.url}>
                                    <SidebarMenuButton asChild isActive={isActive(it.url, it.exact)}>
                                        <Link to={it.url} className="flex items-center gap-2">
                                            <it.icon className="h-4 w-4" />
                                            {!collapsed && <span>{it.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={signOut}>
                            <LogOut className="h-4 w-4" />
                            {!collapsed && <span>Sign out</span>}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export function DashboardTopbar({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <div className="flex h-14 items-center gap-3 px-4">
                <h1 className="text-base font-semibold truncate">{title}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <button className="grid h-9 w-9 place-items-center rounded-md border border-border hover:bg-accent/20" aria-label="Notifications">
                        <Bell className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
