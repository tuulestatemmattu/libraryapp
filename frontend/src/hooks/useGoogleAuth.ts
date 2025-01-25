import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';

interface Profile {
  name: string;
  email: string;
  picture: string;
}

export const useGoogleAuth = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    const cookies = document.cookie
      .split('; ')
      .map((cookie) => cookie.split('='));

    const userCookie = cookies.find((cookie) => cookie[0] === 'user');
    if (userCookie) {
      const decodedValue = decodeURIComponent(userCookie[1]);
      console.log(decodedValue);
      const user = JSON.parse(decodedValue);
      setProfile(user);
    } else {
      console.log('User cookie not found');
    }
  }, []);

  const login = async () => {
    // Retrieve Google Authentication url from the server
    const url = (await axios.get(`${apiBaseUrl}/login`)).data;

    // Redirect to the Google Authentication page
    window.location.href = url;
  };

  const logOut = () => {
    document.cookie = 'user=; Max-Age=0;secure;path=/;';
    setProfile(null);
  };

  return { profile, login, logOut };
};
