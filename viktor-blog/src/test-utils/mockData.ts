import { BlogPost, BlogPostCategory, Author } from '../types/blog.types';

export const mockAuthor: Author = {
  id: 1,
  name: 'John Doe',
  full_name: 'John Doe',
};

export const mockCategory: BlogPostCategory = {
  id: 1,
  name: 'Technology',
};

export const mockBlogPost: BlogPost = {
  id: 1,
  title: 'Test Blog Post',
  description: 'This is a test blog post description',
  excerpt: 'Test excerpt',
  intro: 'Test intro',
  publication_date: '2024-01-15',
  author: mockAuthor,
  blogpost_categories: [mockCategory],
  cover: {
    url: '/uploads/test-image.jpg',
    alternativeText: 'Test image',
  },
};

export const mockBlogPosts: BlogPost[] = Array.from({ length: 8 }, (_, i) => ({
  ...mockBlogPost,
  id: i + 1,
  title: `Test Blog Post ${i + 1}`,
}));

export const mockCategories: BlogPostCategory[] = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'Engineering' },
];

export const mockAuthors: Author[] = [
  { id: 1, name: 'John Doe', full_name: 'John Doe' },
  { id: 2, name: 'Jane Smith', full_name: 'Jane Smith' },
];