import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IsbnPage from './IsbnPage';

describe('IsbnPage Component', () => {
  test('renders correctly with initial props', () => {
    const mockIsbnCallHandler = vi.fn();
    render(<IsbnPage isbnCallHandler={mockIsbnCallHandler} isbn_code="1234567890" />);

    const inputElement = screen.getByLabelText(/isbn/i);
    const buttonElement = screen.getByRole('button', { name: /search/i });

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('1234567890');
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls isbnCallHandler with the correct value on form submit', () => {
    const mockIsbnCallHandler = vi.fn();
    render(<IsbnPage isbnCallHandler={mockIsbnCallHandler} isbn_code="1234567890" />);

    const inputElement = screen.getByLabelText(/isbn/i);
    const buttonElement = screen.getByRole('button', { name: /search/i });

    fireEvent.change(inputElement, { target: { value: '0987654321' } });
    fireEvent.click(buttonElement);

    expect(mockIsbnCallHandler).toHaveBeenCalledWith('0987654321');
    expect(inputElement).toHaveValue('');
  });
});
