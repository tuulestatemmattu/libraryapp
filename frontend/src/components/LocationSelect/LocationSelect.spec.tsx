import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { officeLocations } from '../../constants';
import LocationSelect from './LocationSelect';

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
