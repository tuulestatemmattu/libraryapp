import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';

import { useLogOut } from '../hooks/useLogOut';
import useMainStore from '../hooks/useMainStore';
import Profile from '../interfaces/Profile';
import ProfileCard from './ProfileCard/ProfileCard';

const ProfilePicture = () => {
  const profile = useMainStore((state) => state.profile) as Profile;
  const [open, setOpen] = useState(false);
  const logOut = useLogOut();

  const logOutAndClose = () => {
    logOut();
    setOpen(false);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        <Avatar src={profile.picture} alt="Profile picture" sx={{ cursor: 'pointer' }} />
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
