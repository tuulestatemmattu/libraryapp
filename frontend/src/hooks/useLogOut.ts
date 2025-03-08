import axios from 'axios';

import useMainStore from './useMainStore';

export const useLogOut = () => {
  const removeUser = useMainStore((state) => state.removeUser);

  const logOut = () => {
    document.cookie = 'user=; Max-Age=0;secure;path=/;';
    axios.defaults.headers.common.Authorization = '';
    removeUser();
  };

  return logOut;
};
