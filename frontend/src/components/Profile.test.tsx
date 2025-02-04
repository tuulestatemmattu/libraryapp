import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Profile from './Profile';

describe('Profile Component', () => {
  const mockProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    picture: 'https://example.com/john-doe.jpg',
  };

  const renderComponent = () =>
    render(<Profile profile={mockProfile} />);

  test('should render profile name', () => {
    const { getByText } = renderComponent();
    expect(getByText('Name:')).toBeInTheDocument();
    expect(getByText(mockProfile.name)).toBeInTheDocument();
  });

  test('should render profile email', () => {
    const { getByText } = renderComponent()
    expect(getByText('Email Address:')).toBeInTheDocument();
    expect(getByText(mockProfile.email)).toBeInTheDocument();
  });

  test('should render profile picture', () => {
    const { getByAltText } = renderComponent();
    const imgElement = getByAltText(mockProfile.name + "'s avatar");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', mockProfile.picture);
  });
});
