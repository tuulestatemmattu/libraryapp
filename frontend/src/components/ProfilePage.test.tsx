import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProfilePage from './ProfilePage';

describe('ProfilePage', () => {
  const mockProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    picture: 'http://example.com/john-doe.jpg',
  };

  const mockLogOut = vi.fn();

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ProfilePage profile={mockProfile} logOut={mockLogOut} />
      </BrowserRouter>,
    );

  it('should render profile information', () => {
    const { getByText } = renderComponent();
    expect(getByText(mockProfile.name)).toBeInTheDocument();
    expect(getByText(mockProfile.email)).toBeInTheDocument();
  });

  it('should call logOut and navigate to home on log out button click', () => {
    const { getByText } = renderComponent();
    fireEvent.click(getByText('Log out'));
    expect(mockLogOut).toHaveBeenCalled();
  });
});
