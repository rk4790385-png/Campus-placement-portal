import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getProfile, saveProfile } from "@/lib/local-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
    component: Profile,
});

const schema = z.object({
    full_name: z.string().trim().min(2).max(80),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    usn: z.string().trim().max(40).optional().or(z.literal("")),
    branch: z.string().trim().max(40).optional().or(z.literal("")),
    semester: z.coerce.number().min(1).max(12).optional().or(z.literal("" as never)),
    cgpa: z.coerce.number().min(0).max(10).optional().or(z.literal("" as never)),
    backlogs: z.coerce.number().min(0).max(20).optional().or(z.literal("" as never)),
    skills: z.string().trim().max(500).optional().or(z.literal("")),
    linkedin: z.string().trim().url().optional().or(z.literal("")),
    github: z.string().trim().url().optional().or(z.literal("")),
    portfolio: z.string().trim().url().optional().or(z.literal("")),
    resume_url: z.string().trim().url().optional().or(z.literal("")),
    bio: z.string().trim().max(500).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function Profile() {
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FormValues>({
        resolver: zodResolver(schema) as never,
    });

    useEffect(() => {
        (async () => {
            const profile = getProfile();
            reset({
                ...profile,
                skills: profile.skills.join(", "),
            });
            setLoading(false);
        })();
    }, [reset]);

    const onSubmit = handleSubmit(async (values) => {
        const skillsArr = (values.skills ?? "").toString().split(",").map((s) => s.trim()).filter(Boolean);
        saveProfile({
            full_name: values.full_name,
            phone: values.phone || "",
            usn: values.usn || "",
            branch: values.branch || "",
            semester: values.semester === ("" as never) ? null : (values.semester as number),
            cgpa: values.cgpa === ("" as never) ? null : (values.cgpa as number),
            backlogs: values.backlogs === ("" as never) ? 0 : (values.backlogs as number),
            skills: skillsArr,
            linkedin: values.linkedin || "",
            github: values.github || "",
            portfolio: values.portfolio || "",
            resume_url: values.resume_url || "",
            bio: values.bio || "",
        });
        toast.success("Profile saved");
    });

    if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;

    return (
        <div className="p-6 max-w-4xl">
            <h2 className="text-2xl font-bold">My profile</h2>
            <p className="text-sm text-muted-foreground">Recruiters see this when reviewing your application.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-6">
                <Section title="Personal">
                    <Field label="Full name" error={errors.full_name?.message}><Input {...register("full_name")} /></Field>
                    <Field label="Phone"><Input {...register("phone")} /></Field>
                </Section>

                <Section title="Academic">
                    <Field label="USN / Roll No"><Input {...register("usn")} /></Field>
                    <Field label="Branch"><Input placeholder="CSE / ECE / …" {...register("branch")} /></Field>
                    <Field label="Semester"><Input type="number" min={1} max={12} {...register("semester")} /></Field>
                    <Field label="CGPA"><Input type="number" step="0.01" min={0} max={10} {...register("cgpa")} /></Field>
                    <Field label="Backlogs"><Input type="number" min={0} {...register("backlogs")} /></Field>
                </Section>

                <Section title="Skills & links">
                    <Field label="Skills (comma separated)" wide><Input placeholder="React, TypeScript, Postgres" {...register("skills")} /></Field>
                    <Field label="LinkedIn"><Input placeholder="https://linkedin.com/in/…" {...register("linkedin")} /></Field>
                    <Field label="GitHub"><Input placeholder="https://github.com/…" {...register("github")} /></Field>
                    <Field label="Portfolio"><Input placeholder="https://…" {...register("portfolio")} /></Field>
                    <Field label="Resume URL"><Input placeholder="https://…/resume.pdf" {...register("resume_url")} /></Field>
                </Section>

                <Section title="About">
                    <Field label="Short bio" wide><Textarea rows={4} {...register("bio")} /></Field>
                </Section>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="btn-hero border-0">Save profile</Button>
                </div>
            </form>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card className="glass p-5">
            <div className="font-semibold mb-4">{title}</div>
            <div className="grid md:grid-cols-2 gap-4">{children}</div>
        </Card>
    );
}

function Field({ label, children, error, wide }: { label: string; children: React.ReactNode; error?: string; wide?: boolean }) {
    return (
        <div className={wide ? "md:col-span-2" : undefined}>
            <Label className="text-xs">{label}</Label>
            <div className="mt-1.5">{children}</div>
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}
