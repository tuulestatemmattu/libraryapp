import { useState, useEffect } from 'react';
import {
  googleLogout,
  TokenResponse,
  useGoogleLogin,
} from '@react-oauth/google';
import axios from 'axios';

interface Profile {
  name: string;
  email: string;
  picture: string;
}

export const useGoogleAuth = () => {
  const [user, setUser] = useState<TokenResponse>();
  const [profile, setProfile] = useState<Profile | null>(null);

  const login = useGoogleLogin({
    onSuccess: (response) => setUser(response),
    onError: (error) => console.log('Login Failed:', error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`
        )
        .then((res) => {
          setProfile(res.data);
          console.log(res.data);
          console.log(user);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return { user, profile, login, logOut };
};
