import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
    Rocket, Briefcase, Users, Building2, Award, CheckCircle2, Search, Calendar,
    BarChart3, BookOpenCheck, Sparkles, ArrowRight, Star, ShieldCheck, GraduationCap,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "Campus Placement Portal — Connecting Students with Careers" },
            { name: "description", content: "Premium placement portal for colleges. Students apply to top recruiters, placement cells run drives, companies hire top talent." },
            { property: "og:title", content: "Campus Placement Portal" },
            { property: "og:description", content: "Connecting students with career opportunities." },
        ],
    }),
    component: Landing,
});

function useCountUp(target: number, duration = 1400) {
    const [n, setN] = useState(0);
    const started = useRef(false);
    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const start = performance.now();
        let raf = 0;
        const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setN(Math.floor(target * (0.2 + 0.8 * (1 - Math.pow(1 - p, 3)))));
            if (p < 1) raf = requestAnimationFrame(tick);
            else setN(target);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return n;
}

function Stat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
    const n = useCountUp(value);
    return (
        <div className="glass rounded-2xl p-6 text-center">
            <div className="text-4xl font-extrabold gradient-text">{n.toLocaleString()}{suffix}</div>
            <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        </div>
    );
}

function Landing() {
    return (
        <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
            <SiteHeader />

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        Trusted by 200+ campuses across India
                    </div>
                    <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                        Where talent meets <span className="gradient-text">opportunity</span>.
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        The modern placement portal for colleges and universities. Students discover jobs, recruiters hire top talent, and placement cells run end-to-end drives — all in one elegant platform.
                    </p>
                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild size="lg" className="btn-hero border-0 h-12 px-7 text-base">
                            <Link to="/auth" search={{ mode: "register" } as never}>Register Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base bg-background/40">
                            <Link to="/auth">Explore Jobs</Link>
                        </Button>
                    </div>

                    {/* stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Stat value={250} suffix="+" label="Partner colleges" />
                        <Stat value={1200} suffix="+" label="Recruiting companies" />
                        <Stat value={48000} suffix="+" label="Students placed" />
                        <Stat value={96} suffix="%" label="Placement success" />
                    </div>
                </div>
            </section>

            {/* RECRUITERS */}
            <section id="recruiters" className="mx-auto max-w-7xl px-6 py-16">
                <div className="text-center">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Top recruiters</div>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold">Companies hiring on the portal</h2>
                </div>
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {["Google", "Microsoft", "Amazon", "Adobe", "Atlassian", "Stripe"].map((c) => (
                        <div key={c} className="glass rounded-xl px-4 py-6 grid place-items-center text-sm font-semibold">
                            {c}
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="mx-auto max-w-7xl px-6 py-20">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Built for everyone</div>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold">Everything your placement cell needs</h2>
                    <p className="mt-3 text-muted-foreground">Three powerful workspaces — Students, Recruiters, Placement Officers — sharing one beautifully-designed platform.</p>
                </div>
                <div className="mt-12 grid md:grid-cols-3 gap-5">
                    {[
                        { icon: GraduationCap, title: "Student workspace", desc: "Profile, resume builder, job recommendations, interview tracker, placement status." },
                        { icon: Building2, title: "Recruiter workspace", desc: "Post jobs, screen applicants, shortlist, schedule interviews, message candidates." },
                        { icon: ShieldCheck, title: "Placement officer", desc: "Approve drives, manage students & companies, generate reports, see analytics." },
                        { icon: Search, title: "Smart job discovery", desc: "Filter by CGPA, branch, package, mode, role-type — eligibility computed automatically." },
                        { icon: Calendar, title: "Drives & interviews", desc: "Schedule rounds, share venues, attach JDs, notify everyone in real time." },
                        { icon: BarChart3, title: "Analytics & reports", desc: "Department-wise placement %, highest/average package, exportable CSV/PDF." },
                    ].map((f) => (
                        <div key={f.title} className="glass rounded-2xl p-6 hover:translate-y-[-2px] transition-transform">
                            <div className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                                <f.icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how" className="mx-auto max-w-7xl px-6 py-20">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">How it works</div>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold">From application to offer in 4 steps</h2>
                </div>
                <div className="mt-12 grid md:grid-cols-4 gap-5">
                    {[
                        { icon: Users, title: "Create profile", desc: "Add academic, skills, resume, coding profiles." },
                        { icon: Briefcase, title: "Discover jobs", desc: "Browse eligibility-matched roles from top recruiters." },
                        { icon: BookOpenCheck, title: "Apply & interview", desc: "One-click apply, track interview rounds." },
                        { icon: Award, title: "Get placed", desc: "Receive offers and update placement status." },
                    ].map((s, i) => (
                        <div key={s.title} className="glass rounded-2xl p-6 relative">
                            <div className="absolute -top-3 -right-3 grid h-9 w-9 place-items-center rounded-full bg-background border border-border text-xs font-bold">{i + 1}</div>
                            <s.icon className="h-6 w-6 text-accent" />
                            <h3 className="mt-3 font-semibold">{s.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="text-center">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Loved by students</div>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold">Real outcomes, real careers</h2>
                </div>
                <div className="mt-12 grid md:grid-cols-3 gap-5">
                    {[
                        { name: "Aarav Mehta", role: "SDE @ Amazon", quote: "I tracked every application and interview in one place. The eligibility filter saved me hours every week." },
                        { name: "Sneha Iyer", role: "PM Intern @ Microsoft", quote: "The resume builder is genuinely premium — recruiters specifically mentioned the polish of my PDF." },
                        { name: "Rahul Verma", role: "Software Engineer @ Stripe", quote: "Got my dream offer through the portal. The whole drive ran like clockwork." },
                    ].map((t) => (
                        <div key={t.name} className="glass rounded-2xl p-6">
                            <div className="flex text-warning">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                            <p className="mt-3 text-sm">"{t.quote}"</p>
                            <div className="mt-4">
                                <div className="text-sm font-semibold">{t.name}</div>
                                <div className="text-xs text-muted-foreground">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
                <div className="text-center">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">FAQ</div>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold">Frequently asked questions</h2>
                </div>
                <div className="glass rounded-2xl mt-10 px-6">
                    <Accordion type="single" collapsible className="w-full">
                        {[
                            ["Who can register on the portal?", "Students, placement officers and recruiters can all create accounts. Recruiters need approval from the placement cell before posting jobs."],
                            ["Is the resume builder ATS-friendly?", "Yes — every template is built to pass ATS parsers while staying visually polished."],
                            ["How are eligibility filters computed?", "We use CGPA, branch, semester and backlogs from the student profile, matched against each job's eligibility criteria."],
                            ["Is my data secure?", "Authentication, role-based access control and row-level security are enforced on every record."],
                        ].map(([q, a], i) => (
                            <AccordionItem value={`q${i}`} key={i}>
                                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-6 pb-24">
                <div className="glass rounded-3xl p-10 md:p-14 text-center" style={{ background: "var(--gradient-primary)" }}>
                    <Rocket className="mx-auto h-10 w-10 text-white" />
                    <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white">Ready to find your next opportunity?</h2>
                    <p className="mt-3 text-white/85 max-w-xl mx-auto">Join thousands of students already on the portal and start applying to top companies today.</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button asChild size="lg" variant="secondary" className="h-12 px-7">
                            <Link to="/auth" search={{ mode: "register" } as never}>Register Now</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 px-7 bg-transparent text-white border-white/40 hover:bg-white/10">
                            <Link to="/auth">Login</Link>
                        </Button>
                    </div>
                    <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/85">
                        <li className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Free for students</li>
                        <li className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Verified recruiters</li>
                        <li className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Cancel anytime</li>
                    </ul>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
