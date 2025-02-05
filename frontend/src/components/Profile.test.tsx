import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Profile from './Profilebak';

describe('Profile Component', () => {
  const profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    picture: 'https://example.com/john-doe.jpg',
  };

  test('should render profile name', () => {
    const { getByText } = render(<Profile profile={profile} />);
    expect(getByText('Name:')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();
  });

  test('should render profile email', () => {
    const { getByText } = render(<Profile profile={profile} />);
    expect(getByText('Email Address:')).toBeInTheDocument();
    expect(getByText('john.doe@example.com')).toBeInTheDocument();
  });

  test('should render profile picture', () => {
    const { getByAltText } = render(<Profile profile={profile} />);
    const imgElement = getByAltText("John Doe's avatar");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://example.com/john-doe.jpg');
  });
});
