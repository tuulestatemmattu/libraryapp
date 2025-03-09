import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Profile from '../../interfaces/Profile';
import ProfileCard from './ProfileCard';

describe('ProfileCard', () => {
  const mockProfile: Profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    picture: 'https://example.com/johndoe.jpg',
    admin: true,
  };

  const mockLogOut = vi.fn();

  test('renders profile information correctly', () => {
    render(<ProfileCard profile={mockProfile} logOut={mockLogOut} />);

    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.email)).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProfile.picture);
  });

  test('calls logOut function when logout button is clicked', () => {
    render(<ProfileCard profile={mockProfile} logOut={mockLogOut} />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogOut).toHaveBeenCalledTimes(1);
  });

  test('does not render Admin text if profile is not admin', () => {
    const nonAdminProfile = { ...mockProfile, admin: false };
    render(<ProfileCard profile={nonAdminProfile} logOut={mockLogOut} />);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
