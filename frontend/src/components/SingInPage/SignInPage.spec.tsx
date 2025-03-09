import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Mock, describe, expect, test, vi } from 'vitest';

import { getLoginUrl } from '../../services/login';
import SignInPage from './SignInPage';

vi.mock('../../services/login', () => ({
  getLoginUrl: vi.fn(),
}));

describe('SignInPage', () => {
  test('renders the SignInPage component', () => {
    render(<SignInPage />);
    expect(screen.getByText('Library App')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  test('redirects to login on button click', async () => {
    Object.defineProperty(window, 'location', { value: { assign: vi.fn() } });

    const mockUrl = 'http://mock-login-url.com';
    (getLoginUrl as Mock).mockResolvedValue(mockUrl);

    render(<SignInPage />);
    const button = screen.getByText('Sign in with Google');
    fireEvent.click(button);

    await waitFor(() => {
      expect(getLoginUrl).toHaveBeenCalled();
      expect(window.location.assign).toHaveBeenCalledWith(mockUrl);
    });
  });
});
