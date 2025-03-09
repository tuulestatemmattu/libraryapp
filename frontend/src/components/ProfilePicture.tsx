import axios from 'axios';
import { useState } from 'react';

import { Avatar, Backdrop } from '@mui/material';

import useMainStore from '../hooks/useMainStore';
import Profile from '../interfaces/Profile';
import ProfileCard from './ProfileCard/ProfileCard';

const ProfilePicture = () => {
  const profile = useMainStore((state) => state.profile) as Profile;
  const removeUser = useMainStore((state) => state.removeUser);
  const [open, setOpen] = useState(false);

  const logOutAndClose = () => {
    document.cookie = 'user=; Max-Age=0;secure;path=/;';
    axios.defaults.headers.common.Authorization = '';
    removeUser();
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

export default ProfilePicture;
