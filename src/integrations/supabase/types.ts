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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      age_categories: {
        Row: {
          created_at: string
          event_id: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          max_age: number | null
          min_age: number | null
          name: string
        }
        Insert: {
          created_at?: string
          event_id: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          max_age?: number | null
          min_age?: number | null
          name: string
        }
        Update: {
          created_at?: string
          event_id?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          max_age?: number | null
          min_age?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "age_categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_categories: {
        Row: {
          age_category_id: string
          competition_id: string
          id: string
        }
        Insert: {
          age_category_id: string
          competition_id: string
          id?: string
        }
        Update: {
          age_category_id?: string
          competition_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_categories_age_category_id_fkey"
            columns: ["age_category_id"]
            isOneToOne: false
            referencedRelation: "age_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_categories_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          aggregation_type: Database["public"]["Enums"]["aggregation_type"]
          attempts_count: number | null
          created_at: string
          description: string | null
          event_id: string
          id: string
          is_team_competition: boolean | null
          metric_type: Database["public"]["Enums"]["metric_type"]
          name: string
          penalty_rules: string | null
          rules: string | null
          scoring_formula: string | null
          sort_order: number | null
          team_size: number | null
          updated_at: string
        }
        Insert: {
          aggregation_type: Database["public"]["Enums"]["aggregation_type"]
          attempts_count?: number | null
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          is_team_competition?: boolean | null
          metric_type: Database["public"]["Enums"]["metric_type"]
          name: string
          penalty_rules?: string | null
          rules?: string | null
          scoring_formula?: string | null
          sort_order?: number | null
          team_size?: number | null
          updated_at?: string
        }
        Update: {
          aggregation_type?: Database["public"]["Enums"]["aggregation_type"]
          attempts_count?: number | null
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          is_team_competition?: boolean | null
          metric_type?: Database["public"]["Enums"]["metric_type"]
          name?: string
          penalty_rules?: string | null
          rules?: string | null
          scoring_formula?: string | null
          sort_order?: number | null
          team_size?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          cyclic_month: number | null
          description: string | null
          end_date: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          is_cyclic: boolean | null
          location: string
          logo_url: string | null
          max_participants: number | null
          max_teams: number | null
          name: string
          organizer: string | null
          registration_deadline: string | null
          regulations_pdf_url: string | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          cyclic_month?: number | null
          description?: string | null
          end_date?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          is_cyclic?: boolean | null
          location: string
          logo_url?: string | null
          max_participants?: number | null
          max_teams?: number | null
          name: string
          organizer?: string | null
          registration_deadline?: string | null
          regulations_pdf_url?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          cyclic_month?: number | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_cyclic?: boolean | null
          location?: string
          logo_url?: string | null
          max_participants?: number | null
          max_teams?: number | null
          name?: string
          organizer?: string | null
          registration_deadline?: string | null
          regulations_pdf_url?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          birth_date: string
          created_at: string
          first_name: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          id_number: string | null
          last_name: string
          medical_clearance: boolean | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          birth_date: string
          created_at?: string
          first_name: string
          gender: Database["public"]["Enums"]["gender"]
          id?: string
          id_number?: string | null
          last_name: string
          medical_clearance?: boolean | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string
          created_at?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          id_number?: string | null
          last_name?: string
          medical_clearance?: boolean | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          age_category_id: string
          approved_at: string | null
          approved_by: string | null
          event_id: string
          id: string
          notes: string | null
          participant_id: string
          registration_date: string
          start_number: number | null
          status: Database["public"]["Enums"]["registration_status"] | null
          team_id: string
        }
        Insert: {
          age_category_id: string
          approved_at?: string | null
          approved_by?: string | null
          event_id: string
          id?: string
          notes?: string | null
          participant_id: string
          registration_date?: string
          start_number?: number | null
          status?: Database["public"]["Enums"]["registration_status"] | null
          team_id: string
        }
        Update: {
          age_category_id?: string
          approved_at?: string | null
          approved_by?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          participant_id?: string
          registration_date?: string
          start_number?: number | null
          status?: Database["public"]["Enums"]["registration_status"] | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_age_category_id_fkey"
            columns: ["age_category_id"]
            isOneToOne: false
            referencedRelation: "age_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          attempt_number: number | null
          competition_id: string
          id: string
          notes: string | null
          processed_value: number | null
          raw_value: number | null
          recorded_at: string | null
          recorded_by: string | null
          registration_id: string
          status: Database["public"]["Enums"]["result_status"] | null
          time_value: unknown | null
        }
        Insert: {
          attempt_number?: number | null
          competition_id: string
          id?: string
          notes?: string | null
          processed_value?: number | null
          raw_value?: number | null
          recorded_at?: string | null
          recorded_by?: string | null
          registration_id: string
          status?: Database["public"]["Enums"]["result_status"] | null
          time_value?: unknown | null
        }
        Update: {
          attempt_number?: number | null
          competition_id?: string
          id?: string
          notes?: string | null
          processed_value?: number | null
          raw_value?: number | null
          recorded_at?: string | null
          recorded_by?: string | null
          registration_id?: string
          status?: Database["public"]["Enums"]["result_status"] | null
          time_value?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "results_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_results: {
        Row: {
          age_category_id: string
          calculated_at: string | null
          competition_id: string
          event_id: string
          id: string
          position: number | null
          team_id: string
          total_score: number
        }
        Insert: {
          age_category_id: string
          calculated_at?: string | null
          competition_id: string
          event_id: string
          id?: string
          position?: number | null
          team_id: string
          total_score?: number
        }
        Update: {
          age_category_id?: string
          calculated_at?: string | null
          competition_id?: string
          event_id?: string
          id?: string
          position?: number | null
          team_id?: string
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_results_age_category_id_fkey"
            columns: ["age_category_id"]
            isOneToOne: false
            referencedRelation: "age_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_results_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      aggregation_type:
        | "best_attempt"
        | "sum"
        | "average"
        | "top_n"
        | "drop_worst"
      event_type: "shooting" | "seniors" | "active_village" | "other"
      gender: "male" | "female" | "mixed"
      metric_type: "time" | "points" | "distance" | "count" | "accuracy"
      registration_status: "pending" | "approved" | "rejected" | "cancelled"
      result_status: "valid" | "dns" | "dq" | "dnf"
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
      aggregation_type: [
        "best_attempt",
        "sum",
        "average",
        "top_n",
        "drop_worst",
      ],
      event_type: ["shooting", "seniors", "active_village", "other"],
      gender: ["male", "female", "mixed"],
      metric_type: ["time", "points", "distance", "count", "accuracy"],
      registration_status: ["pending", "approved", "rejected", "cancelled"],
      result_status: ["valid", "dns", "dq", "dnf"],
    },
  },
} as const
