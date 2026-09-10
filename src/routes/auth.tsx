import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { authClient } from "@/integrations/auth/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const authSearch = z.object({ mode: z.enum(["login", "register"]).optional() });

export const Route = createFileRoute("/auth")({
    validateSearch: authSearch,
    head: () => ({
        meta: [
            { title: "Sign in · Campus Placement Portal" },
            { name: "description", content: "Login or register to access the campus placement portal." },
        ],
    }),
    component: AuthPage,
});

const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(6, "At least 6 characters"),
});
const registerSchema = z.object({
    full_name: z.string().trim().min(2, "Required").max(80),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters").max(72),
    role: z.enum(["student", "recruiter"]),
});

function AuthPage() {
    const search = Route.useSearch();
    const navigate = useNavigate();
    const [tab, setTab] = useState<"login" | "register">(search.mode ?? "login");

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) navigate({ to: "/dashboard" });
        });
    }, [navigate]);

    return (
        <div className="min-h-screen grid lg:grid-cols-2" style={{ background: "var(--gradient-hero)" }}>
            <div className="hidden lg:flex flex-col justify-between p-10">
                <Link to="/" className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-bold">Campus Placement Portal</div>
                </Link>
                <div>
                    <h2 className="text-4xl font-extrabold leading-tight">
                        Land your <span className="gradient-text">dream job</span>.<br />Right from campus.
                    </h2>
                    <p className="mt-4 max-w-md text-muted-foreground">
                        Join 48,000+ students already on the portal. Discover roles, apply in one click, and track every interview from a single dashboard.
                    </p>
                    <div className="mt-8 glass rounded-2xl p-5 max-w-md">
                        <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full" style={{ background: "var(--gradient-primary)" }} />
                            <div>
                                <div className="text-sm font-semibold">Sneha Iyer</div>
                                <div className="text-xs text-muted-foreground">PM Intern @ Microsoft</div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm">"Tracked every application and interview in one place. The whole drive ran like clockwork."</p>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Campus Placement Portal</div>
            </div>

            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md glass rounded-2xl p-8">
                    <div className="lg:hidden mb-6 flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div className="font-bold">Campus Placement</div>
                    </div>

                    <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
                        <TabsList className="grid grid-cols-2 w-full">
                            <TabsTrigger value="login">Sign in</TabsTrigger>
                            <TabsTrigger value="register">Create account</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="mt-6">
                            <LoginForm />
                            <GoogleBlock />
                        </TabsContent>

                        <TabsContent value="register" className="mt-6">
                            <RegisterForm onDone={() => setTab("login")} />
                            <GoogleBlock />
                        </TabsContent>
                    </Tabs>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        By continuing you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}

function GoogleBlock() {
    const [loading, setLoading] = useState(false);
    const onGoogle = async () => {
        setLoading(true);
        const r = await authClient.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
        if (r.error) { toast.error("Google sign-in failed"); setLoading(false); }
    };
    return (
        <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
            </div>
            <Button type="button" variant="outline" className="w-full bg-background/40" onClick={onGoogle} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <GoogleIcon className="h-4 w-4 mr-2" />}
                Continue with Google
            </Button>
        </>
    );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" {...props}>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.9l5.7-5.7C33.8 6.5 29.2 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.6-.2-3-.5-4.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13 24 13c2.8 0 5.4 1.1 7.4 2.9l5.7-5.7C33.8 6.5 29.2 4.5 24 4.5c-7.3 0-13.6 4.1-16.7 10.2z" />
            <path fill="#4CAF50" d="M24 45.5c5.1 0 9.7-1.9 13.2-5.1l-6.1-5c-1.9 1.4-4.4 2.3-7.1 2.3-5.3 0-9.7-3.5-11.3-8.4l-6.5 5C9.6 41 16.3 45.5 24 45.5z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.2 5.4l6.1 5c4.3-4 7.3-9.9 7.3-16.4 0-1.6-.2-3-.5-4.5z" />
        </svg>
    );
}

function LoginForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = handleSubmit(async (values) => {
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
        if (error) { toast.error(error.message); return; }
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <Label htmlFor="login-email">Email</Label>
                <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-email" type="email" placeholder="you@college.edu" className="pl-9" {...register("email")} />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="login-password">Password</Label>
                <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-password" type="password" placeholder="••••••••" className="pl-9" {...register("password")} />
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full btn-hero border-0 h-11">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
        </form>
    );
}

function RegisterForm({ onDone }: { onDone: () => void }) {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: "student" },
    });
    const role = watch("role");

    const onSubmit = handleSubmit(async (values) => {
        const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                emailRedirectTo: window.location.origin + "/dashboard",
                data: { full_name: values.full_name, role: values.role },
            },
        });
        if (error) { toast.error(error.message); return; }
        if (data.session) {
            toast.success("Account created — welcome!");
            navigate({ to: "/dashboard" });
        } else {
            toast.success("Check your email to confirm your account.");
            onDone();
        }
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <Label>I am a</Label>
                <Select value={role} onValueChange={(v) => setValue("role", v as "student" | "recruiter")}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="recruiter">Recruiter (company)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="reg-name">Full name</Label>
                <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-name" placeholder="Jane Doe" className="pl-9" {...register("full_name")} />
                </div>
                {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name.message}</p>}
            </div>
            <div>
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-email" type="email" placeholder="you@college.edu" className="pl-9" {...register("email")} />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-password" type="password" placeholder="At least 8 characters" className="pl-9" {...register("password")} />
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full btn-hero border-0 h-11">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
        </form>
    );
}
