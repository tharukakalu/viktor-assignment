import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Image Skeleton */}
      <div className="w-full h-56 skeleton" />
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Category badges */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-20 skeleton rounded-full" />
          <div className="h-6 w-24 skeleton rounded-full" />
        </div>
        
        {/* Title */}
        <div className="space-y-2 mb-3">
          <div className="h-6 skeleton rounded w-full" />
          <div className="h-6 skeleton rounded w-4/5" />
        </div>
        
        {/* Description */}
        <div className="space-y-2 mb-5">
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-3/4" />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-4">
            <div className="h-4 skeleton rounded w-24" />
            <div className="h-4 skeleton rounded w-28" />
          </div>
          <div className="h-5 w-5 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
};