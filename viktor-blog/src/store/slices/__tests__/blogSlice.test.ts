import { configureStore } from '@reduxjs/toolkit';
import blogReducer, {
  setSearchQuery,
  setCategoryId,
  setAuthorId,
  setSortOrder,
  setCurrentPage,
  clearFilters,
  fetchBlogPosts,
} from '../../../store/slices/blogSlice';
import { apiService } from '../../../services/BlogApiService';
import { mockBlogPosts } from '../../../test-utils/mockData';

// Mock API service
jest.mock('../../../services/BlogApiService');

describe('Blog Slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        blog: blogReducer,
      },
    });
  });

  describe('Actions', () => {
    it('should handle setSearchQuery', () => {
      store.dispatch(setSearchQuery('react'));

      const state = store.getState().blog;
      expect(state.searchQuery).toBe('react');
      expect(state.currentPage).toBe(1); // Should reset to page 1
    });

    it('should handle setCategoryId', () => {
      store.dispatch(setCategoryId(5));

      const state = store.getState().blog;
      expect(state.categoryId).toBe(5);
      expect(state.currentPage).toBe(1);
    });

    it('should handle setAuthorId', () => {
      store.dispatch(setAuthorId(3));

      const state = store.getState().blog;
      expect(state.authorId).toBe(3);
      expect(state.currentPage).toBe(1);
    });

    it('should handle setSortOrder', () => {
      store.dispatch(setSortOrder('ASC'));

      const state = store.getState().blog;
      expect(state.sortOrder).toBe('ASC');
      expect(state.currentPage).toBe(1);
    });

    it('should handle setCurrentPage', () => {
      store.dispatch(setCurrentPage(5));

      const state = store.getState().blog;
      expect(state.currentPage).toBe(5);
    });

    it('should handle clearFilters', () => {
      // Set some filters first
      store.dispatch(setSearchQuery('test'));
      store.dispatch(setCategoryId(5));
      store.dispatch(setAuthorId(3));
      store.dispatch(setSortOrder('ASC'));
      store.dispatch(setCurrentPage(10));

      // Clear all filters
      store.dispatch(clearFilters());

      const state = store.getState().blog;
      expect(state.searchQuery).toBe('');
      expect(state.categoryId).toBeNull();
      expect(state.authorId).toBeNull();
      expect(state.sortOrder).toBe('DESC');
      expect(state.currentPage).toBe(1);
    });
  });

  describe('Async Thunks', () => {
    it('should handle fetchBlogPosts.pending', async () => {
      (apiService.getBlogPosts as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );
      (apiService.getBlogPostsCount as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );

      store.dispatch(
        fetchBlogPosts({
          start: 0,
          limit: 8,
        })
      );

      const state = store.getState().blog;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchBlogPosts.fulfilled', async () => {
      (apiService.getBlogPosts as jest.Mock).mockResolvedValue(mockBlogPosts);
      (apiService.getBlogPostsCount as jest.Mock).mockResolvedValue(42);

      await store.dispatch(
        fetchBlogPosts({
          start: 0,
          limit: 8,
        })
      );

      const state = store.getState().blog;
      expect(state.loading).toBe(false);
      expect(state.posts).toEqual(mockBlogPosts);
      expect(state.totalCount).toBe(42);
      expect(state.error).toBeNull();
    });

    it('should handle fetchBlogPosts.rejected', async () => {
      const errorMessage = 'Network error';
      (apiService.getBlogPosts as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await store.dispatch(
        fetchBlogPosts({
          start: 0,
          limit: 8,
        })
      );

      const state = store.getState().blog;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});