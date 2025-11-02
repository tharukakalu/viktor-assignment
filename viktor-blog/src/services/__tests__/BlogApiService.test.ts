import { apiService } from '../BlogApiService';
import { mockBlogPosts, mockCategories, mockAuthors } from '../../test-utils/mockData';

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

describe('BlogApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBlogPosts', () => {
    it('should fetch blog posts with correct parameters', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBlogPosts,
      });

      const result = await apiService.getBlogPosts({
        start: 0,
        limit: 8,
        search: 'react',
        categoryId: 1,
        authorId: 2,
        sortOrder: 'DESC',
      });

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toEqual(mockBlogPosts);
    });

    it('should handle API errors', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(
        apiService.getBlogPosts({ start: 0, limit: 8 })
      ).rejects.toThrow();
    });
  });

  describe('getBlogPostsCount', () => {
    it('should fetch total count', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => 42,
      });

      const result = await apiService.getBlogPostsCount({});

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it('should include filter parameters in count request', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => 10,
      });

      await apiService.getBlogPostsCount({
        search: 'test',
        categoryId: 5,
        authorId: 3,
      });

      expect(mockFetch).toHaveBeenCalled();
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('title_contains=test');
      expect(callUrl).toContain('blogpost_categories.id=5');
      expect(callUrl).toContain('author.id=3');
    });
  });

  describe('getCategories', () => {
    it('should fetch categories', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const result = await apiService.getCategories();

      expect(mockFetch).toHaveBeenCalled();
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('/blogpost-categories');
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getAuthors', () => {
    it('should fetch authors', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuthors,
      });

      const result = await apiService.getAuthors();

      expect(mockFetch).toHaveBeenCalled();
      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('/authors');
      expect(result).toEqual(mockAuthors);
    });
  });
});