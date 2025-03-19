import axios from 'axios';

import { apiBaseUrl } from '../constants';

const getUsers = async () => {
  const response = await axios.get(`${apiBaseUrl}/users`);
  return response.data;
};

const promoteUser = async (email: string) => {
  const response = await axios.post(`${apiBaseUrl}/admin`, { email: email });
  return response.data;
};

export { getUsers, promoteUser };
