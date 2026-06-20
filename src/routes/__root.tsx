import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    Outlet,
    Link,
    createRootRouteWithContext,
    useRouter,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-7xl font-bold gradient-text">404</h1>
                <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="mt-6">
                    <Link to="/" className="btn-hero inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium">
                        Back home
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
    console.error(error);
    const router = useRouter();
    useEffect(() => {
        reportLovableError(error, { boundary: "tanstack_root_error_component" });
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-xl font-semibold">This page didn't load</h1>
                <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head home.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => { router.invalidate(); reset(); }}
                        className="btn-hero inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
                    >Try again</button>
                    <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background/40 px-4 py-2 text-sm font-medium hover:bg-accent/20">Go home</a>
                </div>
            </div>
        </div>
    );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "Campus Placement Portal — Connecting Students with Careers" },
            { name: "description", content: "Modern placement portal for colleges: students apply to top recruiters, placement cells run drives, and companies hire top talent." },
            { property: "og:title", content: "Campus Placement Portal — Connecting Students with Careers" },
            { property: "og:description", content: "Modern placement portal for colleges: students apply to top recruiters, placement cells run drives, and companies hire top talent." },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: "Campus Placement Portal — Connecting Students with Careers" },
            { name: "twitter:description", content: "Modern placement portal for colleges: students apply to top recruiters, placement cells run drives, and companies hire top talent." },
            { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/69f9a473-f478-4ed5-82cb-0e6cbe45ed63" },
            { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/69f9a473-f478-4ed5-82cb-0e6cbe45ed63" },
        ],
        links: [{ rel: "stylesheet", href: appCss }],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head><HeadContent /></head>
            <body>{children}<Scripts /></body>
        </html>
    );
}

function RootComponent() {
    const { queryClient } = Route.useRouteContext();
    const router = useRouter();

    useEffect(() => {
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
            router.invalidate();
            if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
        });
        return () => sub.subscription.unsubscribe();
    }, [router, queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-background text-foreground">
                <Outlet />
                <Toaster richColors position="top-right" />
            </div>
        </QueryClientProvider>
    );
}
