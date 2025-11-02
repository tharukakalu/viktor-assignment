import { config } from '../config/api.config';
import {
  BlogPost,
  BlogPostCategory,
  Author,
  BlogApiParams,
  BlogCountParams,
} from '../types/blog.types';

/**
 * Service class for handling all blog-related API calls
 * Implements centralized error handling and request formatting
 */
class BlogApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
      }
      throw new Error('An unknown error occurred');
    }
  }

  async getBlogPosts(params: BlogApiParams): Promise<BlogPost[]> {
    const queryParams = new URLSearchParams({
      _start: params.start.toString(),
      _limit: params.limit.toString(),
      _sort: `publication_date:${params.sortOrder || 'DESC'}`,
    });

    if (params.search) {
      queryParams.append('title_contains', params.search);
    }
    if (params.categoryId) {
      queryParams.append('blogpost_categories.id', params.categoryId.toString());
    }
    if (params.authorId) {
      queryParams.append('author.id', params.authorId.toString());
    }

    const url = `${this.baseUrl}/blogposts?${queryParams}`;
    return this.fetchWithErrorHandling<BlogPost[]>(url);
  }

  async getBlogPostsCount(params: BlogCountParams): Promise<number> {
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('title_contains', params.search);
    }
    if (params.categoryId) {
      queryParams.append('blogpost_categories.id', params.categoryId.toString());
    }
    if (params.authorId) {
      queryParams.append('author.id', params.authorId.toString());
    }

    const queryString = queryParams.toString();
    const url = `${this.baseUrl}/blogposts/count${queryString ? `?${queryString}` : ''}`;
    return this.fetchWithErrorHandling<number>(url);
  }

  async getCategories(): Promise<BlogPostCategory[]> {
    const url = `${this.baseUrl}/blogpost-categories`;
    return this.fetchWithErrorHandling<BlogPostCategory[]>(url);
  }

  async getAuthors(): Promise<Author[]> {
    const url = `${this.baseUrl}/authors`;
    return this.fetchWithErrorHandling<Author[]>(url);
  }
}

export const apiService = new BlogApiService(config.apiBaseUrl);