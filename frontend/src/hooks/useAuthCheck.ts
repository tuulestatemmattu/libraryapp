import axios from 'axios';
import { useEffect } from 'react';

import Profile from '../interfaces/Profile';
import useMainStore from './useMainStore';

export const useAuthCheck = () => {
  const setUser = useMainStore((state) => state.setUser);
  const removeUser = useMainStore((state) => state.removeUser);

  useEffect(() => {
    const cookies = document.cookie.split('; ').map((cookie) => cookie.split('='));
    const tokenCookie = cookies.find((cookie) => cookie[0] === 'token');
    const profileCookie = cookies.find((cookie) => cookie[0] === 'profile');
    console.log(tokenCookie, profileCookie);

    if (tokenCookie && profileCookie) {
      const token = tokenCookie[1];
      const profile: Profile = JSON.parse(decodeURIComponent(profileCookie[1]));
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(token, profile);
    } else {
      removeUser();
    }
  }, []);
};
