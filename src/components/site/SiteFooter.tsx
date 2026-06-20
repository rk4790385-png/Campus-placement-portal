import { GraduationCap } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="border-t border-border/60 bg-background/60">
            <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div className="font-bold">Campus Placement</div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                        Connecting students with career opportunities at the world's top companies.
                    </p>
                </div>
                <FooterCol title="Product" links={["Features", "How it works", "Recruiters", "Pricing"]} />
                <FooterCol title="Company" links={["About", "Careers", "Contact", "Blog"]} />
                <FooterCol title="Legal" links={["Privacy", "Terms", "Security", "Status"]} />
            </div>
            <div className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Campus Placement Portal · All rights reserved
            </div>
        </footer>
    );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
    return (
        <div>
            <div className="text-sm font-semibold mb-3">{title}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
                {links.map((l) => <li key={l}><a href="#" className="hover:text-foreground transition-colors">{l}</a></li>)}
            </ul>
        </div>
    );
}
