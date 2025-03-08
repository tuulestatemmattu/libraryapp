import axios from 'axios';

import { apiBaseUrl } from '../constants';

const getLoginUrl = async () => {
  const url = (await axios.get(`${apiBaseUrl}/login`)).data;
  return url;
};

export { getLoginUrl };
