import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchQuery,
  setCategoryId,
  setAuthorId,
  setSortOrder,
  setCurrentPage,
  clearFilters,
} from '../store/slices/blogSlice';
import { useDebounce } from '../hooks/useDebounce';
import { useCachedBlogPosts } from '../hooks/useCachedBlogPosts';
import { BlogCard } from '../components/BlogCard';
import { Pagination } from '../components/Pagination';
import { SkeletonCard } from '../components/SkeletonCard';
import { FilterBar } from '../components/FilterBar';
import { config } from '../config/api.config';
import { Layers, TrendingUp } from 'lucide-react';
import { useUrlState } from '../hooks/useUrlState';
import { BlogPost } from '../types/blog.types';

const BlogGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const { getStateFromUrl, updateUrl } = useUrlState();

  const {
    posts,
    categories,
    authors,
    totalCount,
    loading,
    error,
    currentPage,
    searchQuery,
    categoryId,
    authorId,
    sortOrder,
  } = useAppSelector((state) => state.blog);

  const debouncedSearch = useDebounce(searchQuery, config.debounceDelay);

  // Use cached blog posts hook
  useCachedBlogPosts(debouncedSearch);

  // Initialize from URL on mount
  useEffect(() => {
    const urlState = getStateFromUrl();
    dispatch(setSearchQuery(urlState.searchQuery));
    dispatch(setCategoryId(urlState.categoryId));
    dispatch(setAuthorId(urlState.authorId));
    dispatch(setSortOrder(urlState.sortOrder));
    dispatch(setCurrentPage(urlState.page));
  }, []); // Only on mount

  // Update URL when state changes
  useEffect(() => {
    updateUrl({
      searchQuery,
      categoryId,
      authorId,
      sortOrder,
      page: currentPage,
    });
  }, [searchQuery, categoryId, authorId, sortOrder, currentPage, updateUrl]);

  const pageSize = config.defaultPageSize;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handleCategoryChange = (catId: number | null) => {
    dispatch(setCategoryId(catId));
  };

  const handleAuthorChange = (authId: number | null) => {
    dispatch(setAuthorId(authId));
  };

  const handleSortToggle = () => {
    dispatch(setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC'));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters =
    searchQuery !== '' || categoryId !== null || authorId !== null || sortOrder !== 'DESC';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Layers size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Viktor.ai Blog</h1>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp size={16} className="text-blue-200" />
                <span className="text-sm text-blue-100 font-medium">
                  Engineering Innovation Hub
                </span>
              </div>
            </div>
          </div>

          <p className="text-lg text-blue-50 max-w-2xl leading-relaxed">
            Discover insights on parametric design, digital transformation, and cutting-edge
            engineering solutions
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{totalCount}+ Articles</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{categories.length} Categories</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{authors.length} Expert Authors</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <FilterBar
          searchQuery={searchQuery}
          categoryId={categoryId}
          authorId={authorId}
          sortOrder={sortOrder}
          categories={categories}
          authors={authors}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onAuthorChange={handleAuthorChange}
          onSortToggle={handleSortToggle}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          totalCount={totalCount}
          currentCount={posts.length}
          loading={loading}
        />

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-red-900 font-semibold mb-1">Unable to load articles</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: pageSize }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post: BlogPost) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any articles matching your criteria. Try adjusting your filters.
            </p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn-primary inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Viktor.ai Blog
            </p>
    
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogGrid;