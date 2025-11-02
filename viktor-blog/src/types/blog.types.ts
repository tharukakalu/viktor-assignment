export interface Author {
  id: number;
  name?: string;
  full_name?: string;
}

export interface BlogPostCategory {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  title: string;
  description?: string;
  intro?: string;
  excerpt?: string;
  publication_date: string;
  author: Author;
  blogpost_categories: BlogPostCategory[];
  cover?: {
    url: string;
    alternativeText?: string;
  };
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export interface FilterState {
  searchQuery: string;
  categoryId: number | null;
  authorId: number | null;
  sortOrder: 'DESC' | 'ASC';
}

export interface BlogApiParams {
  start: number;
  limit: number;
  search?: string;
  categoryId?: number | null;
  authorId?: number | null;
  sortOrder?: 'DESC' | 'ASC';
}

export interface BlogCountParams {
  search?: string;
  categoryId?: number | null;
  authorId?: number | null;
}