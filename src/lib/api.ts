export type User = { id: string; email: string; fullName: string; role: "student" | "recruiter" };
export type Profile = { fullName: string; phone: string; usn: string; branch: string; semester: number | null; cgpa: number | null; backlogs: number | null; skills: string[]; linkedin: string; github: string; portfolio: string; resumeUrl: string; bio: string };
export type Job = { id: string; title: string; roleType: string; workMode: string; location: string; salaryLpa: number; description: string; minCgpa: number; maxBacklogs: number; openPositions: number; applyDeadline: string; companyName: string; logoUrl: string; website: string };
export type Application = { id: string; status: string; appliedAt: string; job: Job };
let currentUser: User | null = null;
async function request<T>(path: string, options: RequestInit = {}): Promise<T> { const response = await fetch(`/api${path}`, { credentials: "include", headers: { "Content-Type": "application/json", ...options.headers }, ...options }); if (!response.ok) { const body = await response.json().catch(() => null); throw new Error(body?.message ?? "Request failed"); } return response.status === 204 ? undefined as T : response.json() as Promise<T>; }
export async function getUser() { try { currentUser = await request<User>("/auth/me"); } catch { currentUser = null; } return currentUser; }
export function cachedUser() { return currentUser; }
export async function signIn(email: string, password: string) { currentUser = await request<User>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }); return currentUser; }
export async function signUp(fullName: string, email: string, password: string, role: User["role"]) { currentUser = await request<User>("/auth/register", { method: "POST", body: JSON.stringify({ fullName, email, password, role }) }); return currentUser; }
export async function signOut() { await request<void>("/auth/logout", { method: "POST" }); currentUser = null; }
export const getJobs = () => request<Job[]>("/jobs");
export type JobInput = Omit<Job, "logoUrl" | "website"> & { logoUrl?: string; website?: string };
export const createJob = (job: JobInput) => request<Job>("/jobs", { method: "POST", body: JSON.stringify(job) });
export const updateJob = (id: string, job: JobInput) => request<Job>(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(job) });
export const deleteJob = (id: string) => request<void>(`/jobs/${id}`, { method: "DELETE" });
export const getProfile = () => request<Profile>("/profile");
export const saveProfile = (profile: Omit<Profile, "fullName">) => request<Profile>("/profile", { method: "PUT", body: JSON.stringify(profile) });
export const getApplications = () => request<Application[]>("/applications");
export const applyToJob = (jobId: string) => request<Application>(`/applications/${jobId}`, { method: "POST" });
export const withdrawApplication = (id: string) => request<void>(`/applications/${id}`, { method: "DELETE" });
export type RecruiterApplication = Application & { studentName: string; studentEmail: string; usn: string; branch: string; cgpa: number | null };
export const getRecruiterApplications = () => request<RecruiterApplication[]>("/recruiter/applications");
export const updateApplicationStatus = (id: string, status: string) => request<RecruiterApplication>(`/recruiter/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
