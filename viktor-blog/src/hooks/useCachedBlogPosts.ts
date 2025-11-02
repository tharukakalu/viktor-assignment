import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBlogPosts, fetchCategories, fetchAuthors } from '../store/slices/blogSlice';
import { setCacheEntry, clearExpiredCache } from '../store/slices/cacheSlice';
import { config } from '../config/api.config';

/**
 * Custom hook with intelligent caching
 * Prevents duplicate API calls and caches responses
 * Fixed: Removed 'cache' from dependency array to prevent race conditions
 */
export const useCachedBlogPosts = (debouncedSearch: string) => {
  const dispatch = useAppDispatch();
  
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

  const cache = useAppSelector((state) => state.cache.entries);

  // Generate cache key based on current filters
  const cacheKey = useMemo(() => {
    return `posts_${currentPage}_${debouncedSearch}_${categoryId}_${authorId}_${sortOrder}`;
  }, [currentPage, debouncedSearch, categoryId, authorId, sortOrder]);

  // Load metadata (categories and authors) - only once
  useEffect(() => {
    const metadataCacheKey = 'metadata';
    const cachedMetadata = cache[metadataCacheKey];

    if (cachedMetadata && Date.now() - cachedMetadata.timestamp < cachedMetadata.expiresIn) {
      // Use cached data
      return;
    }

    // Fetch fresh data
    dispatch(fetchCategories());
    dispatch(fetchAuthors());
    
    dispatch(
      setCacheEntry({
        key: metadataCacheKey,
        data: { loaded: true },
        expiresIn: 30 * 60 * 1000, // 30 minutes
      })
    );
  }, [dispatch, cache]);

  // Load blog posts with caching - FIXED DEPENDENCY ARRAY
  useEffect(() => {
    // Clear expired cache entries
    dispatch(clearExpiredCache());

    const cachedData = cache[cacheKey];

    // Check if we have valid cached data
    if (cachedData && Date.now() - cachedData.timestamp < cachedData.expiresIn) {
      // Data is cached and still valid, no need to fetch
      console.log('✅ Using cached data for:', cacheKey);
      return;
    }

    // Fetch fresh data
    console.log('🔄 Fetching fresh data for:', cacheKey);
    
    const fetchData = async () => {
      const result = await dispatch(
        fetchBlogPosts({
          start: (currentPage - 1) * config.defaultPageSize,
          limit: config.defaultPageSize,
          search: debouncedSearch,
          categoryId,
          authorId,
          sortOrder,
        })
      );

      // Cache the successful response
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(
          setCacheEntry({
            key: cacheKey,
            data: result.payload,
            expiresIn: 5 * 60 * 1000, // 5 minutes
          })
        );
      }
    };

    fetchData();
    // ✅ FIXED: Removed 'cache' from dependencies to prevent race conditions
    // Only re-run when actual filters change
  }, [dispatch, currentPage, debouncedSearch, categoryId, authorId, sortOrder, cacheKey]);

  return {
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
  };
};