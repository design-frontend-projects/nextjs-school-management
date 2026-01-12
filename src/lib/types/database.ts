export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          created_at?: string;
        };
      };
      school_users: {
        Row: {
          school_id: string;
          user_id: string;
          is_active: boolean;
          joined_at: string;
        };
        Insert: {
          school_id: string;
          user_id: string;
          is_active?: boolean;
          joined_at?: string;
        };
        Update: {
          school_id?: string;
          user_id?: string;
          is_active?: boolean;
          joined_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          description?: string | null;
        };
      };
      user_roles: {
        Row: {
          school_id: string;
          user_id: string;
          role_id: string;
        };
        Insert: {
          school_id: string;
          user_id: string;
          role_id: string;
        };
        Update: {
          school_id?: string;
          user_id?: string;
          role_id?: string;
        };
      };
      permissions: {
        Row: {
          id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
        };
      };
      role_permissions: {
        Row: {
          role_id: string;
          permission_id: string;
        };
        Insert: {
          role_id: string;
          permission_id: string;
        };
        Update: {
          role_id?: string;
          permission_id?: string;
        };
      };
      students: {
        Row: {
          id: string;
          school_id: string;
          class_id: string | null;
          section_id: string | null;
          admission_no: string | null;
          first_name: string | null;
          last_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          class_id?: string | null;
          section_id?: string | null;
          admission_no?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          class_id?: string | null;
          section_id?: string | null;
          admission_no?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
        };
      };
      exams: {
        Row: {
          id: string;
          school_id: string;
          name: string | null;
          exam_date: string | null;
        };
        Insert: {
          id?: string;
          school_id: string;
          name?: string | null;
          exam_date?: string | null;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string | null;
          exam_date?: string | null;
        };
      };
      exam_results: {
        Row: {
          id: string;
          exam_id: string;
          student_id: string;
          subject_id: string | null;
          marks_obtained: number | null;
          max_marks: number | null;
        };
        Insert: {
          id?: string;
          exam_id: string;
          student_id: string;
          subject_id?: string | null;
          marks_obtained?: number | null;
          max_marks?: number | null;
        };
        Update: {
          id?: string;
          exam_id?: string;
          student_id?: string;
          subject_id?: string | null;
          marks_obtained?: number | null;
          max_marks?: number | null;
        };
      };
    };
  };
}
