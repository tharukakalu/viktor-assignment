import { useCallback } from 'react';
import { FilterState } from '../types/blog.types';

/**
 * Custom hook for syncing application state with URL parameters
 * Enables shareable URLs and browser back/forward navigation
 */
export const useUrlState = () => {
  const getStateFromUrl = useCallback((): FilterState & { page: number } => {
    const params = new URLSearchParams(window.location.search);
    
    return {
      searchQuery: params.get('search') || '',
      categoryId: params.get('category') ? Number(params.get('category')) : null,
      authorId: params.get('author') ? Number(params.get('author')) : null,
      sortOrder: (params.get('sort') as 'DESC' | 'ASC') || 'DESC',
      page: Number(params.get('page')) || 1,
    };
  }, []);

  const updateUrl = useCallback((state: Partial<FilterState & { page: number }>) => {
    const params = new URLSearchParams(window.location.search);
    
    Object.entries(state).forEach(([key, value]) => {
      const paramKey = key === 'searchQuery' ? 'search' : key === 'sortOrder' ? 'sort' : key;
      
      if (value !== null && value !== undefined && value !== '') {
        params.set(paramKey, String(value));
      } else {
        params.delete(paramKey);
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, []);

  return { getStateFromUrl, updateUrl };
};