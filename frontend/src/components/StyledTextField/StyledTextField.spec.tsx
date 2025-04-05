import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import StyledTextField from './StyledTextField';

describe('StyledTextField', () => {
  test('renders with correct label', () => {
    const setValue = vi.fn();
    render(<StyledTextField label="ISBN" value="" setValue={setValue} />);
    expect(screen.getByLabelText('ISBN')).toBeInTheDocument();
  });

  test('displays the correct initial value', () => {
    const setValue = vi.fn();
    render(<StyledTextField label="ISBN" value="1234567890" setValue={setValue} />);
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });

  test('calls setValue on change', () => {
    const setValueMock = vi.fn();
    render(<StyledTextField label="ISBN" value="" setValue={setValueMock} />);

    const input = screen.getByLabelText('ISBN');
    fireEvent.change(input, { target: { value: '9876543210' } });
    expect(setValueMock).toHaveBeenCalledWith('9876543210');
  });
});
