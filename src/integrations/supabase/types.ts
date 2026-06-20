export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.5"
    }
    public: {
        Tables: {
            applications: {
                Row: {
                    applied_at: string
                    id: string
                    job_id: string
                    status: string
                    student_id: string
                }
                Insert: {
                    applied_at?: string
                    id?: string
                    job_id: string
                    status?: string
                    student_id: string
                }
                Update: {
                    applied_at?: string
                    id?: string
                    job_id?: string
                    status?: string
                    student_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "applications_job_id_fkey"
                        columns: ["job_id"]
                        isOneToOne: false
                        referencedRelation: "jobs"
                        referencedColumns: ["id"]
                    },
                ]
            }
            companies: {
                Row: {
                    created_at: string
                    description: string | null
                    employees: string | null
                    id: string
                    industry: string | null
                    location: string | null
                    logo_url: string | null
                    name: string
                    website: string | null
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    employees?: string | null
                    id?: string
                    industry?: string | null
                    location?: string | null
                    logo_url?: string | null
                    name: string
                    website?: string | null
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    employees?: string | null
                    id?: string
                    industry?: string | null
                    location?: string | null
                    logo_url?: string | null
                    name?: string
                    website?: string | null
                }
                Relationships: []
            }
            jobs: {
                Row: {
                    apply_deadline: string | null
                    company_id: string
                    created_at: string
                    description: string | null
                    eligibility_branches: string[] | null
                    id: string
                    location: string | null
                    max_backlogs: number | null
                    min_cgpa: number | null
                    open_positions: number | null
                    role_type: string | null
                    salary_lpa: number | null
                    status: string | null
                    title: string
                    work_mode: string | null
                }
                Insert: {
                    apply_deadline?: string | null
                    company_id: string
                    created_at?: string
                    description?: string | null
                    eligibility_branches?: string[] | null
                    id?: string
                    location?: string | null
                    max_backlogs?: number | null
                    min_cgpa?: number | null
                    open_positions?: number | null
                    role_type?: string | null
                    salary_lpa?: number | null
                    status?: string | null
                    title: string
                    work_mode?: string | null
                }
                Update: {
                    apply_deadline?: string | null
                    company_id?: string
                    created_at?: string
                    description?: string | null
                    eligibility_branches?: string[] | null
                    id?: string
                    location?: string | null
                    max_backlogs?: number | null
                    min_cgpa?: number | null
                    open_positions?: number | null
                    role_type?: string | null
                    salary_lpa?: number | null
                    status?: string | null
                    title?: string
                    work_mode?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "jobs_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    email: string | null
                    full_name: string | null
                    id: string
                    phone: string | null
                    updated_at: string
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    full_name?: string | null
                    id: string
                    phone?: string | null
                    updated_at?: string
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    phone?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            students: {
                Row: {
                    address: string | null
                    backlogs: number | null
                    bio: string | null
                    branch: string | null
                    cgpa: number | null
                    created_at: string
                    dob: string | null
                    gender: string | null
                    github: string | null
                    hackerrank: string | null
                    id: string
                    leetcode: string | null
                    linkedin: string | null
                    portfolio: string | null
                    resume_url: string | null
                    roll_number: string | null
                    semester: number | null
                    skills: string[] | null
                    soft_skills: string[] | null
                    tenth_pct: number | null
                    twelfth_pct: number | null
                    updated_at: string
                    usn: string | null
                }
                Insert: {
                    address?: string | null
                    backlogs?: number | null
                    bio?: string | null
                    branch?: string | null
                    cgpa?: number | null
                    created_at?: string
                    dob?: string | null
                    gender?: string | null
                    github?: string | null
                    hackerrank?: string | null
                    id: string
                    leetcode?: string | null
                    linkedin?: string | null
                    portfolio?: string | null
                    resume_url?: string | null
                    roll_number?: string | null
                    semester?: number | null
                    skills?: string[] | null
                    soft_skills?: string[] | null
                    tenth_pct?: number | null
                    twelfth_pct?: number | null
                    updated_at?: string
                    usn?: string | null
                }
                Update: {
                    address?: string | null
                    backlogs?: number | null
                    bio?: string | null
                    branch?: string | null
                    cgpa?: number | null
                    created_at?: string
                    dob?: string | null
                    gender?: string | null
                    github?: string | null
                    hackerrank?: string | null
                    id?: string
                    leetcode?: string | null
                    linkedin?: string | null
                    portfolio?: string | null
                    resume_url?: string | null
                    roll_number?: string | null
                    semester?: number | null
                    skills?: string[] | null
                    soft_skills?: string[] | null
                    tenth_pct?: number | null
                    twelfth_pct?: number | null
                    updated_at?: string
                    usn?: string | null
                }
                Relationships: []
            }
            user_roles: {
                Row: {
                    id: string
                    role: Database["public"]["Enums"]["app_role"]
                    user_id: string
                }
                Insert: {
                    id?: string
                    role: Database["public"]["Enums"]["app_role"]
                    user_id: string
                }
                Update: {
                    id?: string
                    role?: Database["public"]["Enums"]["app_role"]
                    user_id?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            has_role: {
                Args: {
                    _role: Database["public"]["Enums"]["app_role"]
                    _user_id: string
                }
                Returns: boolean
            }
        }
        Enums: {
            app_role: "student" | "recruiter" | "admin"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
            app_role: ["student", "recruiter", "admin"],
        },
    },
} as const
