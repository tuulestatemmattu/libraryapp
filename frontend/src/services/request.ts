import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { Request } from '../interfaces/Request';

const baseUrl = apiBaseUrl + '/requests';

const getBookRequests = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const sendBookRequest = async (request: Request) => {
  const response = await axios.post(baseUrl, request);
  return response.data;
};

const deleteBookRequest = async (id: number) => {
  await axios.delete(`${baseUrl}/${id}`);
};

export { getBookRequests, sendBookRequest, deleteBookRequest };
