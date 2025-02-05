import { Avatar, Backdrop } from '@mui/material';
import React, { useState } from 'react';
import ProfileCard from './ProfileCard/ProfileCard';

interface ProfileProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)}>
        <Avatar src={profile.picture} />
      </div>
      <Backdrop open={open} onClick={() => setOpen(false)}>
        <ProfileCard profile={profile} />
      </Backdrop>
    </>
  );
};

export default Profile;
