import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getApplications, getUser, withdrawApplication } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/applications")({
    component: Applications,
});

const statusVariant: Record<string, string> = {
    applied: "secondary",
    shortlisted: "default",
    offered: "default",
    rejected: "destructive",
};

function Applications() {
    const qc = useQueryClient();
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => { getUser().then((user) => setUserId(user?.id ?? null)); }, []);

    const { data = [] } = useQuery({
        queryKey: ["myApplications", userId],
        enabled: !!userId,
        queryFn: getApplications,
    });

    const withdraw = useMutation({
        mutationFn: async (id: string) => {
            await withdrawApplication(id);
        },
        onSuccess: () => {
            toast.success("Application withdrawn");
            qc.invalidateQueries({ queryKey: ["myApplications"] });
            qc.invalidateQueries({ queryKey: ["myAppliedJobIds"] });
            qc.invalidateQueries({ queryKey: ["appsCount"] });
        },
    });

    return (
        <div className="p-6 space-y-5">
            <div>
                <h2 className="text-2xl font-bold">My applications</h2>
                <p className="text-sm text-muted-foreground">Track every role you've applied to.</p>
            </div>

            <div className="grid gap-4">
                {data.map((a: any) => (
                    <Card key={a.id} className="glass p-5 flex items-center gap-4 flex-wrap">
                        <img src={a.job?.logoUrl} alt="" className="h-12 w-12 rounded-lg bg-white object-contain p-1.5" />
                        <div className="flex-1 min-w-[180px]">
                            <div className="font-semibold">{a.job?.title}</div>
                            <div className="text-xs text-muted-foreground">{a.job?.companyName} · {a.job?.location}</div>
                            <div className="text-xs text-muted-foreground mt-1">Applied {new Date(a.appliedAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm font-semibold">₹{a.job?.salaryLpa} LPA</div>
                        <Badge variant={(statusVariant[a.status] ?? "secondary") as never}>{a.status}</Badge>
                        <Button variant="outline" size="sm" disabled={withdraw.isPending} onClick={() => withdraw.mutate(a.id)}>Withdraw</Button>
                    </Card>
                ))}
                {data.length === 0 && (
                    <Card className="glass p-10 text-center text-sm text-muted-foreground">
                        You haven't applied to any jobs yet. Head to <span className="text-foreground font-medium">Browse Jobs</span> to get started.
                    </Card>
                )}
            </div>
        </div>
    );
}
