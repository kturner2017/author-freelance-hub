export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      book_parts: {
        Row: {
          created_at: string | null
          id: string
          sort_order: number
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          sort_order: number
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          sort_order?: number
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string
          cover_image_url: string | null
          created_at: string | null
          id: string
          subtitle: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author: string
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author?: string
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contract_templates: {
        Row: {
          category: string
          content: string
          created_at: string | null
          description: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          description: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          description?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      freelancer_subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          freelancer_id: string
          id: string
          starts_at: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          freelancer_id: string
          id?: string
          starts_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          freelancer_id?: string
          id?: string
          starts_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_subscriptions_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancers: {
        Row: {
          bio: string
          created_at: string | null
          education: string[] | null
          email: string | null
          experience: string[] | null
          expertise_areas: Database["public"]["Enums"]["expertise_area"][]
          full_name: string
          headline: string
          hourly_rate: number | null
          id: string
          portfolio_links: string[] | null
          skills: string[]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio: string
          created_at?: string | null
          education?: string[] | null
          email?: string | null
          experience?: string[] | null
          expertise_areas?: Database["public"]["Enums"]["expertise_area"][]
          full_name: string
          headline: string
          hourly_rate?: number | null
          id?: string
          portfolio_links?: string[] | null
          skills?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string
          created_at?: string | null
          education?: string[] | null
          email?: string | null
          experience?: string[] | null
          expertise_areas?: Database["public"]["Enums"]["expertise_area"][]
          full_name?: string
          headline?: string
          hourly_rate?: number | null
          id?: string
          portfolio_links?: string[] | null
          skills?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      front_matter_content: {
        Row: {
          book_id: string
          content: string | null
          created_at: string
          front_matter_option_id: string
          id: string
          updated_at: string
        }
        Insert: {
          book_id: string
          content?: string | null
          created_at?: string
          front_matter_option_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          content?: string | null
          created_at?: string
          front_matter_option_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "front_matter_content_front_matter_option_id_fkey"
            columns: ["front_matter_option_id"]
            isOneToOne: false
            referencedRelation: "front_matter_options"
            referencedColumns: ["id"]
          },
        ]
      }
      front_matter_options: {
        Row: {
          book_id: string | null
          created_at: string
          enabled: boolean | null
          id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          book_id?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          book_id?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "front_matter_options_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      launch_strategies: {
        Row: {
          benefits: string[]
          created_at: string | null
          description: string
          estimated_cost: string
          id: string
          summary: string
          timeline: string
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string[]
          created_at?: string | null
          description: string
          estimated_cost: string
          id?: string
          summary: string
          timeline: string
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string[]
          created_at?: string | null
          description?: string
          estimated_cost?: string
          id?: string
          summary?: string
          timeline?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      manuscript_acts: {
        Row: {
          book_id: string | null
          created_at: string | null
          id: string
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          sort_order: number
          title: string
          updated_at?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manuscript_acts_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      manuscript_boxes: {
        Row: {
          act: string
          box_id: string
          chapter_id: string
          content: string | null
          created_at: string | null
          id: string
          part_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          act: string
          box_id: string
          chapter_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          part_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          act?: string
          box_id?: string
          chapter_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          part_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manuscript_boxes_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "book_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      manuscript_chapters: {
        Row: {
          book_id: string | null
          chapter_id: string
          content: string | null
          created_at: string | null
          id: string
          sort_order: number
          template: string | null
          updated_at: string | null
        }
        Insert: {
          book_id?: string | null
          chapter_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          sort_order: number
          template?: string | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string | null
          chapter_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          sort_order?: number
          template?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manuscript_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      manuscript_files: {
        Row: {
          box_id: string
          content_type: string | null
          created_at: string | null
          file_path: string
          filename: string
          id: string
          size: number | null
        }
        Insert: {
          box_id: string
          content_type?: string | null
          created_at?: string | null
          file_path: string
          filename: string
          id?: string
          size?: number | null
        }
        Update: {
          box_id?: string
          content_type?: string | null
          created_at?: string | null
          file_path?: string
          filename?: string
          id?: string
          size?: number | null
        }
        Relationships: []
      }
      manuscript_goals: {
        Row: {
          book_id: string
          created_at: string
          id: string
          target_date: string
          target_word_count: number
          updated_at: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          target_date?: string
          target_word_count?: number
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          target_date?: string
          target_word_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "manuscript_goals_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      matter_templates: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_milestones: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          payment_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_milestones_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          auto_release_payments: boolean | null
          created_at: string
          default_payment_type:
            | Database["public"]["Enums"]["payment_type"]
            | null
          id: string
          notification_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_release_payments?: boolean | null
          created_at?: string
          default_payment_type?:
            | Database["public"]["Enums"]["payment_type"]
            | null
          id?: string
          notification_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_release_payments?: boolean | null
          created_at?: string
          default_payment_type?:
            | Database["public"]["Enums"]["payment_type"]
            | null
          id?: string
          notification_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          held_at: string | null
          id: string
          payment_id: string | null
          platform_fee: number
          receiver_id: string
          released_at: string | null
          sender_id: string
          status:
            | Database["public"]["Enums"]["payment_transaction_status"]
            | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          held_at?: string | null
          id?: string
          payment_id?: string | null
          platform_fee?: number
          receiver_id: string
          released_at?: string | null
          sender_id: string
          status?:
            | Database["public"]["Enums"]["payment_transaction_status"]
            | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          held_at?: string | null
          id?: string
          payment_id?: string | null
          platform_fee?: number
          receiver_id?: string
          released_at?: string | null
          sender_id?: string
          status?:
            | Database["public"]["Enums"]["payment_transaction_status"]
            | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          description: string | null
          freelancer_id: string | null
          id: string
          project_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          type: Database["public"]["Enums"]["payment_type"] | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          description?: string | null
          freelancer_id?: string | null
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          type?: Database["public"]["Enums"]["payment_type"] | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          description?: string | null
          freelancer_id?: string | null
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          type?: Database["public"]["Enums"]["payment_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_bids: {
        Row: {
          amount: number
          created_at: string | null
          freelancer_id: string
          id: string
          project_id: string
          proposal_text: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          freelancer_id: string
          id?: string
          project_id: string
          proposal_text: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          freelancer_id?: string
          id?: string
          project_id?: string
          proposal_text?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_bids_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_bids_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          content_type: string | null
          created_at: string | null
          file_path: string
          filename: string
          id: string
          project_id: string | null
          size: number | null
          updated_at: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          file_path: string
          filename: string
          id?: string
          project_id?: string | null
          size?: number | null
          updated_at?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          file_path?: string
          filename?: string
          id?: string
          project_id?: string | null
          size?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          author: string
          book_title: string
          created_at: string | null
          genre: string
          id: string
          project_name: string
          template_version: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author: string
          book_title: string
          created_at?: string | null
          genre: string
          id?: string
          project_name: string
          template_version?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author?: string
          book_title?: string
          created_at?: string | null
          genre?: string
          id?: string
          project_name?: string
          template_version?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      writing_progress: {
        Row: {
          book_id: string
          created_at: string
          date: string
          id: string
          updated_at: string
          word_count: number
          words_added: number
          words_removed: number
        }
        Insert: {
          book_id: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          word_count?: number
          words_added?: number
          words_removed?: number
        }
        Update: {
          book_id?: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          word_count?: number
          words_added?: number
          words_removed?: number
        }
        Relationships: [
          {
            foreignKeyName: "writing_progress_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      expertise_area:
        | "editing"
        | "cover_design"
        | "marketing"
        | "ghostwriting"
        | "illustration"
        | "formatting"
        | "proofreading"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      payment_transaction_status:
        | "pending"
        | "held"
        | "released"
        | "refunded"
        | "failed"
      payment_type: "milestone" | "full"
      subscription_tier: "free" | "premium"
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
      expertise_area: [
        "editing",
        "cover_design",
        "marketing",
        "ghostwriting",
        "illustration",
        "formatting",
        "proofreading",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      payment_transaction_status: [
        "pending",
        "held",
        "released",
        "refunded",
        "failed",
      ],
      payment_type: ["milestone", "full"],
      subscription_tier: ["free", "premium"],
    },
  },
} as const
