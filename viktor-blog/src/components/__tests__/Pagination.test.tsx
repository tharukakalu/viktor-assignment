import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders correct number of page buttons', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );

    // Should show pages 1, 2, 3, 4, 5
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('highlights current page', () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={mockOnPageChange} />
    );

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-gradient-to-r', 'from-blue-600');
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination currentPage={10} totalPages={10} onPageChange={mockOnPageChange} />
    );

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when page button clicked', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );

    const page3Button = screen.getByText('3');
    fireEvent.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
  });

  it('calls onPageChange when next button clicked', () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />
    );

    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('shows ellipsis for large page counts', () => {
    render(
      <Pagination currentPage={5} totalPages={50} onPageChange={mockOnPageChange} />
    );

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('renders correct pages around current page', () => {
    render(
      <Pagination currentPage={10} totalPages={50} onPageChange={mockOnPageChange} />
    );

    // Should show: 1 ... 9 10 11 ... 50
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});