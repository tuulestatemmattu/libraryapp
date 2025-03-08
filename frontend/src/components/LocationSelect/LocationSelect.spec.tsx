import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import LocationSelect from './LocationSelect';
import { officeLocations } from '../../constants';

describe('LocationSelect', () => {
  test('renders correctly with given value', () => {
    render(<LocationSelect value="Helsinki" onChangeLocation={vi.fn()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Helsinki')).toBeInTheDocument();
  });

  test('displays all office locations in the dropdown', () => {
    render(<LocationSelect value="" onChangeLocation={vi.fn()} />);

    fireEvent.mouseDown(screen.getByRole('combobox'));

    officeLocations.forEach((location) => {
      expect(screen.getByText(location)).toBeInTheDocument();
    });
  });

  test('calls onChangeLocation when a new location is selected', () => {
    const handleChange = vi.fn();
    render(<LocationSelect value="" onChangeLocation={handleChange} />);

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Tampere'));

    expect(handleChange).toHaveBeenCalledWith('Tampere');
  });
});
