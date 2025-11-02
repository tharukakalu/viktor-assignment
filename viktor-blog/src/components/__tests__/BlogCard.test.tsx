import React from 'react';
import { BlogCard } from '../BlogCard';
import { mockBlogPost } from '../../test-utils/mockData';
import { render, screen } from '../../test-utils/test-utils';  // Not @testing-library/react

describe('BlogCard Component', () => {
  it('renders blog post title correctly', () => {
    render(<BlogCard post={mockBlogPost} />);
    
    const title = screen.getByText('Test Blog Post');
    expect(title).toBeInTheDocument();
  });

  it('displays blog post description', () => {
    render(<BlogCard post={mockBlogPost} />);
    
    const description = screen.getByText(/This is a test blog post description/i);
    expect(description).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<BlogCard post={mockBlogPost} />);
    
    const author = screen.getByText('John Doe');
    expect(author).toBeInTheDocument();
  });

  it('displays formatted publication date', () => {
    render(<BlogCard post={mockBlogPost} />);
    
    const date = screen.getByText(/Jan 15, 2024/i);
    expect(date).toBeInTheDocument();
  });

  it('renders category badges', () => {
    render(<BlogCard post={mockBlogPost} />);
    
    const category = screen.getByText('Technology');
    expect(category).toBeInTheDocument();
    expect(category).toHaveClass('bg-gradient-to-r');
  });

it('renders image with correct src', async () => {  // ← Make it async
  render(<BlogCard post={mockBlogPost} />);
  
  // Use findByAltText which already waits for the element
  const image = await screen.findByAltText('Test image');
  
  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute('src', 'https://cms.viktor.ai/uploads/test-image.jpg');
});

  it('handles missing cover image gracefully', () => {
    const postWithoutImage = { ...mockBlogPost, cover: undefined };
    render(<BlogCard post={postWithoutImage} />);
    
    // Component should still render without errors
    const title = screen.getByText('Test Blog Post');
    expect(title).toBeInTheDocument();
    
    // Should not have an image
    expect(screen.queryByAltText(/Test image/i)).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to article', () => {
    render(<BlogCard post={mockBlogPost} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveClass('group', 'bg-white', 'rounded-xl');
  });

  it('displays up to 2 category badges', () => {
    const postWithManyCategories = {
      ...mockBlogPost,
      blogpost_categories: [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
      ],
    };
    
    render(<BlogCard post={postWithManyCategories} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.queryByText('Category 3')).not.toBeInTheDocument();
  });

  it('uses excerpt when description is not available', () => {
    const postWithExcerpt = {
      ...mockBlogPost,
      description: undefined,
      excerpt: 'This is the excerpt text',
    };
    
    render(<BlogCard post={postWithExcerpt} />);
    
    expect(screen.getByText('This is the excerpt text')).toBeInTheDocument();
  });

  it('uses intro when description and excerpt are not available', () => {
    const postWithIntro = {
      ...mockBlogPost,
      description: undefined,
      excerpt: undefined,
      intro: 'This is the intro text',
    };
    
    render(<BlogCard post={postWithIntro} />);
    
    expect(screen.getByText('This is the intro text')).toBeInTheDocument();
  });

  it('handles missing author name gracefully', () => {
    const postWithoutAuthorName = {
      ...mockBlogPost,
      author: { id: 1 },
    };
    
    render(<BlogCard post={postWithoutAuthorName as any} />);
    
    expect(screen.getByText('Unknown Author')).toBeInTheDocument();
  });

// it('renders arrow icon for read more', () => {
//   const { container } = render(<BlogCard post={mockBlogPost} />);
  
//   // Find by class name since there's no test-id
//   const arrowIcon = container.querySelector('.lucide-arrow-right');
//   expect(arrowIcon).toBeInTheDocument();
// });
});