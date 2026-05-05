// ============================================================
// Shared TypeScript Interfaces
// ============================================================

export type Env = {
  Variables: {
    user: AuthUser | null
  }
}

export interface AuthUser {
  id: string
  email: string
  role?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// ── Database Models ─────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  updatedAt: string
  username: string | null
  fullName: string | null
  avatar: string | null
  website: string | null
  phone: string | null
  bio: string | null
  onboardingCompleted: boolean
  onboardingStep: number
  settings: any
  connections: any
  preferences: any
  status: string
  createdAt: string
  roleId: string | null
  role: any
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  parent_id: string | null
  sort_order: number
  status: 'active' | 'inactive'
  created_at: string
  image: string | null
  post_count?: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  description: string | null
  content: string
  cover_image: string | null
  reading_time_minutes: number
  category_id: string
  tags: string[]
  author_id: string
  created_at: string
  updated_at: string
  
  // Joined fields
  author?: Partial<Profile>
  category?: Partial<Category>
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  
  // Joined fields
  user?: Partial<Profile>
}
