import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Briefcase, FileCheck2, GraduationCap, TrendingUp, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/dashboard/")({
    component: Overview,
});

type StudentRow = {
    id: string; usn: string | null; branch: string | null; semester: number | null;
    cgpa: number | null; skills: string[] | null; resume_url: string | null;
    linkedin: string | null; github: string | null;
};

function Overview() {
    const [userId, setUserId] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string>("");

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id ?? null);
            setFullName(data.user?.user_metadata?.full_name ?? data.user?.email?.split("@")[0] ?? "Student");
        });
    }, []);

    const { data: student } = useQuery({
        queryKey: ["student", userId],
        enabled: !!userId,
        queryFn: async (): Promise<StudentRow | null> => {
            const { data } = await supabase.from("students").select("id,usn,branch,semester,cgpa,skills,resume_url,linkedin,github").eq("id", userId!).maybeSingle();
            return data as StudentRow | null;
        },
    });

    const { data: jobsCount } = useQuery({
        queryKey: ["jobsCount"],
        queryFn: async () => {
            const { count } = await supabase.from("jobs").select("*", { count: "exact", head: true });
            return count ?? 0;
        },
    });

    const { data: appsCount } = useQuery({
        queryKey: ["appsCount", userId],
        enabled: !!userId,
        queryFn: async () => {
            const { count } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("student_id", userId!);
            return count ?? 0;
        },
    });

    const completion = profileCompletion(student);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Welcome back, {fullName.split(" ")[0]} 👋</h2>
                <p className="text-sm text-muted-foreground">Here's a snapshot of your placement journey.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard icon={GraduationCap} label="Profile completion" value={`${completion}%`} accent />
                <StatCard icon={Briefcase} label="Open jobs" value={`${jobsCount ?? 0}`} />
                <StatCard icon={FileCheck2} label="Applications" value={`${appsCount ?? 0}`} />
                <StatCard icon={TrendingUp} label="CGPA" value={student?.cgpa ? student.cgpa.toFixed(2) : "—"} />
            </div>

            <Card className="glass p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Finish your profile</h3>
                        <p className="text-sm text-muted-foreground">A complete profile makes you 4× more likely to get shortlisted.</p>
                    </div>
                    <div className="w-full max-w-sm">
                        <Progress value={completion} />
                        <div className="mt-2 text-xs text-muted-foreground">{completion}% complete</div>
                    </div>
                </div>
            </Card>

            <RecentJobs />
        </div>
    );
}

function profileCompletion(s: StudentRow | null | undefined): number {
    if (!s) return 10;
    const checks = [s.usn, s.branch, s.semester, s.cgpa, s.skills && s.skills.length > 0, s.resume_url, s.linkedin, s.github];
    const done = checks.filter(Boolean).length;
    return Math.max(10, Math.round((done / checks.length) * 100));
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Briefcase; label: string; value: string; accent?: boolean }) {
    return (
        <Card className="glass p-5">
            <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${accent ? "" : "bg-muted"}`} style={accent ? { background: "var(--gradient-primary)" } : undefined}>
                    <Icon className={`h-5 w-5 ${accent ? "text-white" : "text-foreground"}`} />
                </div>
                <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                </div>
            </div>
        </Card>
    );
}

function RecentJobs() {
    const { data } = useQuery({
        queryKey: ["recentJobs"],
        queryFn: async () => {
            const { data } = await supabase
                .from("jobs")
                .select("id,title,role_type,work_mode,location,salary_lpa,company:companies(name,logo_url)")
                .order("created_at", { ascending: false })
                .limit(4);
            return data ?? [];
        },
    });

    return (
        <div>
            <h3 className="font-semibold mb-3">Latest jobs</h3>
            <div className="grid md:grid-cols-2 gap-4">
                {(data ?? []).map((j: any) => (
                    <Card key={j.id} className="glass p-5">
                        <div className="flex items-center gap-3">
                            <img src={j.company?.logo_url} alt="" className="h-10 w-10 rounded-md bg-white object-contain p-1" />
                            <div className="min-w-0">
                                <div className="font-semibold truncate">{j.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{j.company?.name} · {j.location}</div>
                            </div>
                            <div className="ml-auto text-right">
                                <div className="text-sm font-semibold">₹{j.salary_lpa} LPA</div>
                                <Badge variant="secondary" className="mt-1 text-[10px]">{j.role_type}</Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
