export type LocalUser = {
    id: string;
    email: string;
    fullName: string;
    role: "student" | "recruiter";
};

export type LocalProfile = {
    full_name: string;
    phone: string;
    usn: string;
    branch: string;
    semester: number | "";
    cgpa: number | "";
    backlogs: number | "";
    skills: string[];
    linkedin: string;
    github: string;
    portfolio: string;
    resume_url: string;
    bio: string;
};

export type Job = {
    id: string;
    title: string;
    role_type: string;
    work_mode: string;
    location: string;
    salary_lpa: number;
    description: string;
    min_cgpa: number;
    max_backlogs: number;
    open_positions: number;
    apply_deadline: string;
    company: { name: string; logo_url: string; website: string };
};

export type LocalApplication = {
    id: string;
    job_id: string;
    status: string;
    applied_at: string;
};

const sessionKey = "campus-placement-session";
const profileKey = "campus-placement-profile";
const applicationsKey = "campus-placement-applications";

export const jobs: Job[] = [
    {
        id: "job-google-swe",
        title: "Software Engineer",
        role_type: "Full Time",
        work_mode: "Hybrid",
        location: "Bengaluru",
        salary_lpa: 28,
        description: "Build reliable products used by millions of people with a collaborative engineering team.",
        min_cgpa: 7.5,
        max_backlogs: 0,
        open_positions: 8,
        apply_deadline: "2026-10-15",
        company: { name: "Google", logo_url: "https://logo.clearbit.com/google.com", website: "https://google.com" },
    },
    {
        id: "job-microsoft-pm",
        title: "Product Management Intern",
        role_type: "Internship",
        work_mode: "Onsite",
        location: "Hyderabad",
        salary_lpa: 12,
        description: "Work with product and engineering teams to shape thoughtful experiences for customers.",
        min_cgpa: 7,
        max_backlogs: 1,
        open_positions: 4,
        apply_deadline: "2026-10-22",
        company: { name: "Microsoft", logo_url: "https://logo.clearbit.com/microsoft.com", website: "https://microsoft.com" },
    },
    {
        id: "job-amazon-data",
        title: "Data Analyst",
        role_type: "Full Time",
        work_mode: "Remote",
        location: "India",
        salary_lpa: 18,
        description: "Turn large datasets into clear insights that help teams make better decisions.",
        min_cgpa: 6.5,
        max_backlogs: 1,
        open_positions: 12,
        apply_deadline: "2026-11-01",
        company: { name: "Amazon", logo_url: "https://logo.clearbit.com/amazon.com", website: "https://amazon.jobs" },
    },
    {
        id: "job-adobe-frontend",
        title: "Frontend Developer",
        role_type: "Full Time",
        work_mode: "Hybrid",
        location: "Noida",
        salary_lpa: 16,
        description: "Create accessible, polished interfaces with a modern React and TypeScript stack.",
        min_cgpa: 7,
        max_backlogs: 0,
        open_positions: 6,
        apply_deadline: "2026-10-28",
        company: { name: "Adobe", logo_url: "https://logo.clearbit.com/adobe.com", website: "https://adobe.com" },
    },
];

const defaultProfile = (user: LocalUser): LocalProfile => ({
    full_name: user.fullName,
    phone: "",
    usn: "",
    branch: "",
    semester: "",
    cgpa: "",
    backlogs: "",
    skills: [],
    linkedin: "",
    github: "",
    portfolio: "",
    resume_url: "",
    bio: "",
});

function read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try { return JSON.parse(window.localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}

function write<T>(key: string, value: T) {
    if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export function getUser(): LocalUser | null { return read<LocalUser | null>(sessionKey, null); }

export function signIn(email: string, password: string): LocalUser {
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const existing = getUser();
    const user = existing?.email === email ? existing : { id: `user-${email.toLowerCase()}`, email, fullName: email.split("@")[0] || "Student", role: "student" as const };
    write(sessionKey, user);
    return user;
}

export function signUp(fullName: string, email: string, password: string, role: LocalUser["role"]): LocalUser {
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    const user = { id: `user-${email.toLowerCase()}`, email, fullName, role };
    write(sessionKey, user);
    write(profileKey, defaultProfile(user));
    return user;
}

export function signOut() { if (typeof window !== "undefined") window.localStorage.removeItem(sessionKey); }

export function getProfile(): LocalProfile {
    const user = getUser();
    return read(profileKey, user ? defaultProfile(user) : defaultProfile({ id: "", email: "", fullName: "Student", role: "student" }));
}

export function saveProfile(profile: LocalProfile) { write(profileKey, profile); }

export function getApplications(): LocalApplication[] { return read<LocalApplication[]>(applicationsKey, []); }

export function applyToJob(jobId: string) {
    const applications = getApplications();
    if (!applications.some((application) => application.job_id === jobId)) {
        write(applicationsKey, [{ id: `application-${Date.now()}`, job_id: jobId, status: "applied", applied_at: new Date().toISOString() }, ...applications]);
    }
}

export function withdrawApplication(id: string) { write(applicationsKey, getApplications().filter((application) => application.id !== id)); }
