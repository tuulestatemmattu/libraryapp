import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IsbnPage from './IsbnPage';

describe('IsbnPage Component', () => {
  test('calls isbnHandler with the correct value on form submit', () => {
    const mockIsbnHandler = vi.fn();
    render(<IsbnPage isbnHandler={mockIsbnHandler} />);

    const inputElement = screen.getByLabelText(/isbn/i);
    const buttonElement = screen.getByRole('button', { name: /search/i });

    fireEvent.change(inputElement, { target: { value: '0987654321' } });
    fireEvent.click(buttonElement);

    expect(mockIsbnHandler).toHaveBeenCalledWith('0987654321');
    expect(inputElement).toHaveValue('');
  });
});
