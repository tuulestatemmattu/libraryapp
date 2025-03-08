import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dialog from './Dialog';

describe('Dialog Component', () => {
  test('renders children correctly', () => {
    render(
      <Dialog toggleDialog={vi.fn()}>
        <div>Dialog Content</div>
      </Dialog>,
    );
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  test('calls toggleDialog after 2 seconds', () => {
    vi.useFakeTimers();
    const toggleDialog = vi.fn();
    render(
      <Dialog toggleDialog={toggleDialog}>
        <div>Dialog Content</div>
      </Dialog>,
    );
    vi.advanceTimersByTime(2000);
    expect(toggleDialog).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  test('calls toggleDialog when clicking outside the dialog', () => {
    const toggleDialog = vi.fn();
    render(
      <Dialog toggleDialog={toggleDialog}>
        <div>Dialog Content</div>
      </Dialog>,
    );
    const container = screen.getByText('Dialog Content').parentElement;
    fireEvent.click(container as Element);
    expect(toggleDialog).toHaveBeenCalledTimes(1);
  });

  test('does not call toggleDialog when clicking inside the dialog', () => {
    const toggleDialog = vi.fn();
    render(
      <Dialog toggleDialog={toggleDialog}>
        <div>Dialog Content</div>
      </Dialog>,
    );
    fireEvent.click(screen.getByText('Dialog Content'));
    expect(toggleDialog).not.toHaveBeenCalled();
  });
});
