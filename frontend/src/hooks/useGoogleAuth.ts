import { useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import useMainStore from './useMainStore';
import Profile from '../interfaces/Profile';

export const useGoogleAuth = () => {
  const setUser = useMainStore((state) => state.setUser);
  const removeUser = useMainStore((state) => state.removeUser);

  useEffect(() => {
    const cookies = document.cookie.split('; ').map((cookie) => cookie.split('='));
    const tokenCookie = cookies.find((cookie) => cookie[0] === 'token');
    const profileCookie = cookies.find((cookie) => cookie[0] === 'profile');

    if (tokenCookie && profileCookie) {
      const token = tokenCookie[1];
      const profile: Profile = JSON.parse(decodeURIComponent(profileCookie[1]));
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(token, profile);
    } else {
      console.log('User cookie not found');
    }
  }, []);

  const login = async () => {
    const url = (await axios.get(`${apiBaseUrl}/login`)).data;
    window.location.href = url;
  };

  const logOut = () => {
    document.cookie = 'user=; Max-Age=0;secure;path=/;';
    axios.defaults.headers.common.Authorization = '';
    removeUser();
  };

  return { login, logOut };
};
