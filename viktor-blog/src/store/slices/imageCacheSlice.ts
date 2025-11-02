import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageCacheState {
  cachedImages: Record<string, {
    url: string;
    timestamp: number;
    loaded: boolean;
  }>;
}

const initialState: ImageCacheState = {
  cachedImages: {},
};

const IMAGE_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const imageCacheSlice = createSlice({
  name: 'imageCache',
  initialState,
  reducers: {
    addImageToCache: (
      state,
      action: PayloadAction<{ key: string; url: string }>
    ) => {
      state.cachedImages[action.payload.key] = {
        url: action.payload.url,
        timestamp: Date.now(),
        loaded: true,
      };
    },
    markImageLoading: (state, action: PayloadAction<string>) => {
      if (!state.cachedImages[action.payload]) {
        state.cachedImages[action.payload] = {
          url: action.payload,
          timestamp: Date.now(),
          loaded: false,
        };
      }
    },
    clearImageCache: (state) => {
      state.cachedImages = {};
    },
    clearExpiredImages: (state) => {
      const now = Date.now();
      Object.keys(state.cachedImages).forEach((key) => {
        const image = state.cachedImages[key];
        if (now - image.timestamp > IMAGE_CACHE_DURATION) {
          delete state.cachedImages[key];
        }
      });
    },
  },
});

export const {
  addImageToCache,
  markImageLoading,
  clearImageCache,
  clearExpiredImages,
} = imageCacheSlice.actions;

export default imageCacheSlice.reducer;