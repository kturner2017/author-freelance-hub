export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      freelancers: {
        Row: {
          bio: string
          created_at: string | null
          education: string[] | null
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
          updated_at: string | null
        }
        Insert: {
          book_id?: string | null
          chapter_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          sort_order: number
          updated_at?: string | null
        }
        Update: {
          book_id?: string | null
          chapter_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          sort_order?: number
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
          type: string
          updated_at: string | null
        }
        Insert: {
          author: string
          book_title: string
          created_at?: string | null
          genre: string
          id?: string
          project_name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          book_title?: string
          created_at?: string | null
          genre?: string
          id?: string
          project_name?: string
          type?: string
          updated_at?: string | null
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
      expertise_area:
        | "editing"
        | "cover_design"
        | "marketing"
        | "ghostwriting"
        | "illustration"
        | "formatting"
        | "proofreading"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
