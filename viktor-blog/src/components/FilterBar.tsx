import React from 'react';
import { Search, Filter, User, SortDesc, X } from 'lucide-react';
import { BlogPostCategory, Author } from '../types/blog.types';

interface FilterBarProps {
  searchQuery: string;
  categoryId: number | null;
  authorId: number | null;
  sortOrder: 'DESC' | 'ASC';
  categories: BlogPostCategory[];
  authors: Author[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (id: number | null) => void;
  onAuthorChange: (id: number | null) => void;
  onSortToggle: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
  currentCount: number;
  loading: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  categoryId,
  authorId,
  sortOrder,
  categories,
  authors,
  onSearchChange,
  onCategoryChange,
  onAuthorChange,
  onSortToggle,
  onClearFilters,
  hasActiveFilters,
  totalCount,
  currentCount,
  loading,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1 relative group">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search articles by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-sm font-medium placeholder:text-gray-400"
          />
        </div>

        {/* Category Filter */}
        <div className="relative lg:w-56">
          <Filter
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
          <select
            value={categoryId || ''}
            onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full pl-11 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white outline-none cursor-pointer text-sm font-medium transition-all duration-300"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Author Filter */}
        <div className="relative lg:w-56">
          <User
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
          <select
            value={authorId || ''}
            onChange={(e) => onAuthorChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full pl-11 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white outline-none cursor-pointer text-sm font-medium transition-all duration-300"
          >
            <option value="">All Authors</option>
            {authors
              .filter(author => author) // <-- This removes any null/undefined authors
              .map((author) => (
                <option key={author.id} value={author.id}>
                  {author.full_name || author.name || 'Unnamed Author'}
                </option>
              ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sort Button */}
        <button
          onClick={onSortToggle}
          className="px-5 py-3.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center gap-2.5 justify-center text-sm font-medium"
          title={`Sorted by date: ${sortOrder === 'DESC' ? 'Newest first' : 'Oldest first'}`}
        >
          <SortDesc
            size={18}
            className={`transition-transform duration-300 ${sortOrder === 'ASC' ? 'rotate-180' : ''}`}
          />
          <span className="hidden sm:inline">{sortOrder === 'DESC' ? 'Newest' : 'Oldest'}</span>
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-5 py-3.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center gap-2 justify-center font-medium text-sm border-2 border-red-100"
          >
            <X size={18} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Loading articles...
            </span>
          ) : (
            <span className="font-medium">
              Showing <span className="text-blue-600 font-semibold">{currentCount}</span> of{' '}
              <span className="text-gray-900 font-semibold">{totalCount}</span> articles
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Filter size={14} />
            <span>Filters active</span>
          </div>
        )}
      </div>
    </div>
  );
};