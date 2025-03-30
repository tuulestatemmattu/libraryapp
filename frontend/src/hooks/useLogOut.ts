import axios from 'axios';

import useMainStore from './useMainStore';

export const useLogOut = () => {
  const removeUser = useMainStore((state) => state.removeUser);

  const logOut = () => {
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
    axios.defaults.headers.common.Authorization = '';
    removeUser();
  };

  return logOut;
};
