import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import StyledInput from './StyledInput';

describe('StyledInput', () => {
  test('renders with correct label', () => {
    render(<StyledInput label="ISBN" value="" setValue={() => {}} />);
    expect(screen.getByLabelText('ISBN')).toBeInTheDocument();
  });

  test('displays the correct initial value', () => {
    render(<StyledInput label="ISBN" value="1234567890" setValue={() => {}} />);
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });

  test('calls setValue on change', () => {
    const setValueMock = vi.fn();
    render(<StyledInput label="ISBN" value="" setValue={setValueMock} />);

    const input = screen.getByLabelText('ISBN');
    fireEvent.change(input, { target: { value: '9876543210' } });
    expect(setValueMock).toHaveBeenCalledWith('9876543210');
  });
});
