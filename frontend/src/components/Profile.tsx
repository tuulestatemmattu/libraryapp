import React from 'react';

interface ProfileProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <div>
      <img src={profile.picture} alt={`${profile.name}'s avatar`} />
      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email Address:</strong> {profile.email}
      </p>
    </div>
  );
};

export default Profile;
