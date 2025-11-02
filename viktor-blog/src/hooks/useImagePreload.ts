import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addImageToCache, markImageLoading, clearExpiredImages } from '../store/slices/imageCacheSlice';

/**
 * Custom hook for preloading and caching images with Redux
 * Images are cached globally and persist across component remounts
 */
export const useImagePreload = (src: string | undefined): {
  imageSrc: string | undefined;
  isLoading: boolean;
  hasError: boolean;
} => {
  const dispatch = useAppDispatch();
  const cachedImages = useAppSelector((state) => state.imageCache.cachedImages);
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    const fullUrl = src.startsWith('http') 
      ? src 
      : `${process.env.REACT_APP_API_BASE_URL}${src}`;

    // Clear expired images on mount
    dispatch(clearExpiredImages());

    // Check Redux cache first
    const cached = cachedImages[fullUrl];
    if (cached && cached.loaded) {
      console.log('✅ Image from Redux cache:', fullUrl);
      setIsLoading(false);
      return;
    }

    // Mark as loading in Redux
    dispatch(markImageLoading(fullUrl));

    // Preload image
    console.log('🔄 Loading image:', fullUrl);
    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Image loaded successfully:', fullUrl);
      dispatch(addImageToCache({ key: fullUrl, url: fullUrl }));
      setIsLoading(false);
    };

    img.onerror = () => {
      console.error('❌ Image failed to load:', fullUrl);
      setHasError(true);
      setIsLoading(false);
    };

    img.src = fullUrl;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, dispatch, cachedImages]);

  const fullUrl = src?.startsWith('http') 
    ? src 
    : src ? `${process.env.REACT_APP_API_BASE_URL}${src}` : undefined;

  return { 
    imageSrc: fullUrl, 
    isLoading, 
    hasError 
  };
};