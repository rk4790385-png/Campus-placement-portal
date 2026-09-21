import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { createJob, getRecruiterApplications, getUser, type JobInput, updateApplicationStatus } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/dashboard/recruiter")({
    beforeLoad: async () => { if ((await getUser())?.role !== "recruiter") throw redirect({ to: "/dashboard" }); },
    component: RecruiterDashboard,
});

const initial = (): JobInput => ({ id: `job-${crypto.randomUUID().slice(0, 8)}`, title: "", companyName: "", roleType: "Full Time", workMode: "Onsite", location: "", salaryLpa: 0, description: "", minCgpa: 0, maxBacklogs: 0, openPositions: 1, applyDeadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) });

function RecruiterDashboard() {
    const qc = useQueryClient(); const [job, setJob] = useState<JobInput>(initial);
    const { data: applications = [] } = useQuery({ queryKey: ["recruiterApplications"], queryFn: getRecruiterApplications });
    const post = useMutation({ mutationFn: createJob, onSuccess: () => { toast.success("Job published"); setJob(initial()); qc.invalidateQueries({ queryKey: ["jobs"] }); }, onError: (e: Error) => toast.error(e.message) });
    const status = useMutation({ mutationFn: ({ id, value }: { id: string; value: string }) => updateApplicationStatus(id, value), onSuccess: () => qc.invalidateQueries({ queryKey: ["recruiterApplications"] }), onError: (e: Error) => toast.error(e.message) });
    const set = (key: keyof JobInput, value: string | number) => setJob((current) => ({ ...current, [key]: value }));
    return <div className="p-6 space-y-6 max-w-6xl"><div><h2 className="text-2xl font-bold">Recruiter workspace</h2><p className="text-sm text-muted-foreground">Publish roles and progress applications.</p></div>
        <Card className="glass p-5"><h3 className="font-semibold mb-4">Post a job</h3><div className="grid md:grid-cols-2 gap-3"><Input value={job.title} onChange={(e) => set("title", e.target.value)} placeholder="Job title"/><Input value={job.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Company name"/><Input value={job.location} onChange={(e) => set("location", e.target.value)} placeholder="Location"/><Input type="number" value={job.salaryLpa} onChange={(e) => set("salaryLpa", Number(e.target.value))} placeholder="Salary LPA"/><Input type="date" value={job.applyDeadline} onChange={(e) => set("applyDeadline", e.target.value)} /><Input type="number" min="1" value={job.openPositions} onChange={(e) => set("openPositions", Number(e.target.value))} placeholder="Open positions"/><Input className="md:col-span-2" value={job.description} onChange={(e) => set("description", e.target.value)} placeholder="Role description"/></div><Button className="mt-4 btn-hero border-0" disabled={post.isPending || !job.title || !job.companyName || !job.location || !job.description} onClick={() => post.mutate(job)}>Publish job</Button></Card>
        <Card className="glass p-5"><h3 className="font-semibold mb-4">Applicants ({applications.length})</h3><div className="space-y-3">{applications.map((application) => <div key={application.id} className="rounded-lg border border-border p-4 flex flex-wrap items-center gap-3"><div className="flex-1"><div className="font-medium">{application.studentName} <span className="text-muted-foreground font-normal">· {application.job.title}</span></div><div className="text-xs text-muted-foreground">{application.studentEmail} · {application.branch || "Branch not added"} · CGPA {application.cgpa ?? "—"}</div></div><Select value={application.status} onValueChange={(value) => status.mutate({ id: application.id, value })}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="applied">Applied</SelectItem><SelectItem value="shortlisted">Shortlisted</SelectItem><SelectItem value="rejected">Rejected</SelectItem><SelectItem value="offered">Offered</SelectItem></SelectContent></Select></div>)}{applications.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}</div></Card>
    </div>;
}
