import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresIn: number; // milliseconds
}

interface CacheState {
  entries: Record<string, CacheEntry>;
}

const initialState: CacheState = {
  entries: {},
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setCacheEntry: (
      state,
      action: PayloadAction<{ key: string; data: any; expiresIn?: number }>
    ) => {
      state.entries[action.payload.key] = {
        data: action.payload.data,
        timestamp: Date.now(),
        expiresIn: action.payload.expiresIn || CACHE_DURATION,
      };
    },
    clearCache: (state) => {
      state.entries = {};
    },
    clearExpiredCache: (state) => {
      const now = Date.now();
      Object.keys(state.entries).forEach((key) => {
        const entry = state.entries[key];
        if (now - entry.timestamp > entry.expiresIn) {
          delete state.entries[key];
        }
      });
    },
  },
});

export const { setCacheEntry, clearCache, clearExpiredCache } = cacheSlice.actions;

export default cacheSlice.reducer;