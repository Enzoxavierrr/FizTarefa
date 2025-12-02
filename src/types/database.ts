export interface Database {
  public: {
    Tables: {
      lists: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          list_id: string | null
          title: string
          description: string | null
          completed: boolean
          pomodoros_completed: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          list_id?: string | null
          title: string
          description?: string | null
          completed?: boolean
          pomodoros_completed?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          list_id?: string | null
          title?: string
          description?: string | null
          completed?: boolean
          pomodoros_completed?: number
          created_at?: string
        }
      }
    }
  }
}

