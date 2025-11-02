import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/BlogApiService';
import { BlogPost, BlogPostCategory, Author } from '../../types/blog.types';

interface BlogState {
  posts: BlogPost[];
  categories: BlogPostCategory[];
  authors: Author[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
  categoryId: number | null;
  authorId: number | null;
  sortOrder: 'DESC' | 'ASC';
}

const initialState: BlogState = {
  posts: [],
  categories: [],
  authors: [],
  totalCount: 0,
  loading: false,
  error: null,
  currentPage: 1,
  searchQuery: '',
  categoryId: null,
  authorId: null,
  sortOrder: 'DESC',
};

// Async thunks for API calls
export const fetchBlogPosts = createAsyncThunk(
  'blog/fetchPosts',
  async (
    params: {
      start: number;
      limit: number;
      search?: string;
      categoryId?: number | null;
      authorId?: number | null;
      sortOrder?: 'DESC' | 'ASC';
    },
    { rejectWithValue }
  ) => {
    try {
      const [posts, count] = await Promise.all([
        apiService.getBlogPosts(params),
        apiService.getBlogPostsCount({
          search: params.search,
          categoryId: params.categoryId,
          authorId: params.authorId,
        }),
      ]);
      return { posts, count };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch posts');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'blog/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.getCategories();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const fetchAuthors = createAsyncThunk(
  'blog/fetchAuthors',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.getAuthors();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch authors');
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCategoryId: (state, action: PayloadAction<number | null>) => {
      state.categoryId = action.payload;
      state.currentPage = 1;
    },
    setAuthorId: (state, action: PayloadAction<number | null>) => {
      state.authorId = action.payload;
      state.currentPage = 1;
    },
    setSortOrder: (state, action: PayloadAction<'DESC' | 'ASC'>) => {
      state.sortOrder = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.categoryId = null;
      state.authorId = null;
      state.sortOrder = 'DESC';
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch posts
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });

    // Fetch authors
    builder
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.authors = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setCategoryId,
  setAuthorId,
  setSortOrder,
  setCurrentPage,
  clearFilters,
} = blogSlice.actions;

export default blogSlice.reducer;