import { configureStore } from '@reduxjs/toolkit';
import blogReducer from '../store/slices/blogSlice';
import cacheReducer from '../store/slices/cacheSlice';
import imageCacheReducer from './slices/imageCacheSlice'; 

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    cache: cacheReducer,
    imageCache: imageCacheReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For Date objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;