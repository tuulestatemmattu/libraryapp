import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { getToken } from '../util/getToken';

const getUsers = async () => {
  const token = getToken();
  const response = await axios.get(`${apiBaseUrl}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const promoteUsers = async (email: string) => {
  const token = getToken();
  console.log(email);

  const response = await axios.post(
    `${apiBaseUrl}/admin`,
    { email: email },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return response.data;
};

export { getUsers, promoteUsers };
