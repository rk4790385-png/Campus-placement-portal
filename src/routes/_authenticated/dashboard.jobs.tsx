import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, MapPin, Calendar, Building2 } from "lucide-react";
import { toast } from "sonner";

import { applyToJob, getApplications, getUser, jobs as seedJobs } from "@/lib/local-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/dashboard/jobs")({
    component: Jobs,
});

type Job = {
    id: string; title: string; role_type: string; work_mode: string; location: string;
    salary_lpa: number; description: string; min_cgpa: number; max_backlogs: number;
    open_positions: number; apply_deadline: string;
    company: { name: string; logo_url: string; website: string } | null;
};

function Jobs() {
    const qc = useQueryClient();
    const userId = getUser()?.id ?? null;
    const [q, setQ] = useState("");
    const [mode, setMode] = useState<string>("all");
    const [type, setType] = useState<string>("all");

    const { data: jobs = [] } = useQuery({
        queryKey: ["jobs"],
        queryFn: async (): Promise<Job[]> => seedJobs,
    });

    const { data: applied = new Set<string>() } = useQuery({
        queryKey: ["myAppliedJobIds", userId],
        enabled: !!userId,
        queryFn: async () => new Set(getApplications().map((application) => application.job_id)),
    });

    const apply = useMutation({
        mutationFn: async (jobId: string) => {
            if (!userId) throw new Error("Not signed in");
            applyToJob(jobId);
        },
        onSuccess: () => {
            toast.success("Application submitted");
            qc.invalidateQueries({ queryKey: ["myAppliedJobIds"] });
            qc.invalidateQueries({ queryKey: ["appsCount"] });
            qc.invalidateQueries({ queryKey: ["myApplications"] });
        },
        onError: (e: any) => toast.error(e.message ?? "Could not apply"),
    });

    const filtered = useMemo(() => {
        return jobs.filter((j) => {
            if (mode !== "all" && j.work_mode !== mode) return false;
            if (type !== "all" && j.role_type !== type) return false;
            if (q.trim()) {
                const s = q.toLowerCase();
                if (!j.title.toLowerCase().includes(s) && !(j.company?.name?.toLowerCase().includes(s))) return false;
            }
            return true;
        });
    }, [jobs, q, mode, type]);

    return (
        <div className="p-6 space-y-5">
            <div>
                <h2 className="text-2xl font-bold">Browse jobs</h2>
                <p className="text-sm text-muted-foreground">{filtered.length} open roles from top recruiters.</p>
            </div>

            <Card className="glass p-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by role or company" className="pl-9" />
                </div>
                <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any mode</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any type</SelectItem>
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                    </SelectContent>
                </Select>
            </Card>

            <div className="grid gap-4">
                {filtered.map((j) => {
                    const isApplied = applied.has(j.id);
                    return (
                        <Card key={j.id} className="glass p-5">
                            <div className="flex flex-wrap gap-4">
                                <img src={j.company?.logo_url} alt="" className="h-14 w-14 rounded-lg bg-white object-contain p-1.5" />
                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-lg">{j.title}</h3>
                                        <Badge variant="secondary">{j.role_type}</Badge>
                                        <Badge variant="outline">{j.work_mode}</Badge>
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
                                        <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{j.company?.name}</span>
                                        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                                        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Apply by {new Date(j.apply_deadline).toLocaleDateString()}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{j.description}</p>
                                    <div className="mt-3 flex gap-2 flex-wrap text-xs text-muted-foreground">
                                        <span>Min CGPA: <b className="text-foreground">{j.min_cgpa}</b></span>
                                        <span>· Max backlogs: <b className="text-foreground">{j.max_backlogs}</b></span>
                                        <span>· Positions: <b className="text-foreground">{j.open_positions}</b></span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between gap-2">
                                    <div className="text-xl font-bold gradient-text">₹{j.salary_lpa} LPA</div>
                                    <Button
                                        disabled={isApplied || apply.isPending}
                                        className={isApplied ? "" : "btn-hero border-0"}
                                        variant={isApplied ? "outline" : "default"}
                                        onClick={() => apply.mutate(j.id)}
                                    >
                                        {isApplied ? "Applied" : "Apply now"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
                {filtered.length === 0 && (
                    <Card className="glass p-10 text-center text-sm text-muted-foreground">No jobs match your filters.</Card>
                )}
            </div>
        </div>
    );
}
