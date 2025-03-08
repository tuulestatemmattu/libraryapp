import { Avatar, Backdrop } from '@mui/material';
import { useState } from 'react';
import ProfileCard from './ProfileCard/ProfileCard';
import useMainStore from '../hooks/useMainStore';
import Profile from '../interfaces/Profile';
import { useLogOut } from '../hooks/useLogOut';

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
