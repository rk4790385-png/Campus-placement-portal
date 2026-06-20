import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <Link to="/" className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm font-bold">Campus Placement</div>
                        <div className="text-[10px] text-muted-foreground -mt-0.5">PORTAL</div>
                    </div>
                </Link>
                <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
                    <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                    <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
                    <a href="#recruiters" className="hover:text-foreground transition-colors">Recruiters</a>
                    <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
                </nav>
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost"><Link to="/auth">Login</Link></Button>
                    <Button asChild className="btn-hero border-0"><Link to="/auth" search={{ mode: "register" } as never}>Register</Link></Button>
                </div>
            </div>
        </header>
    );
}
