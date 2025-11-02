import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import blogReducer from '../store/slices/blogSlice';
import cacheReducer from '../store/slices/cacheSlice';
import imageCacheReducer from '../store/slices/imageCacheSlice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: any;
}

/**
 * Custom render function with Redux Provider
 * Allows testing components with Redux state
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: combineReducers({
        blog: blogReducer,
        cache: cacheReducer,
        imageCache: imageCacheReducer,
      }),
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { renderWithProviders as render }; // Override default render