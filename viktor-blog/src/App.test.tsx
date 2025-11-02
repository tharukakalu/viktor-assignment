import { screen, waitFor } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test-utils/test-utils';
import { apiService } from './services/BlogApiService';
import { mockBlogPosts, mockCategories, mockAuthors } from './test-utils/mockData';

// Mock API service
jest.mock('./services/BlogApiService');

describe('App Component', () => {
  beforeEach(() => {
    // Mock all API calls to prevent real network requests
    (apiService.getBlogPosts as jest.Mock).mockResolvedValue(mockBlogPosts);
    (apiService.getBlogPostsCount as jest.Mock).mockResolvedValue(42);
    (apiService.getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (apiService.getAuthors as jest.Mock).mockResolvedValue(mockAuthors);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders blog grid with Redux provider', async () => {
    renderWithProviders(<App />);
    
    // Wait for header to render (use getByRole for unique h1)
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1, name: /Viktor\.ai Blog/i });
      expect(heading).toBeInTheDocument();
    });
  });

  it('renders engineering innovation hub subtitle', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      const subtitle = screen.getByText(/Engineering Innovation Hub/i);
      expect(subtitle).toBeInTheDocument();
    });
  });

  it('renders main content area', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  it('renders footer', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });
});