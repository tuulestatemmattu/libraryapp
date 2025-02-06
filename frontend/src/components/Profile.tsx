import { Avatar, Backdrop } from '@mui/material';
import React, { useState } from 'react';
import ProfileCard from './ProfileCard/ProfileCard';
import { ProfileProps } from '../interfaces/ProfileProps';

const Profile: React.FC<ProfileProps> = ({ profile, logOut }) => {
  const [open, setOpen] = useState(false);

  const logOutAndClose = () => {
    logOut();
    setOpen(false);
  };
  return (
    <>
      <div onClick={() => setOpen(true)}>
        <Avatar src={profile.picture} />
      </div>
      <Backdrop
        open={open}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            setOpen(false);
          }
        }}
      >
        <ProfileCard profile={profile} logOut={logOutAndClose} />
      </Backdrop>
    </>
  );
};

export default Profile;
