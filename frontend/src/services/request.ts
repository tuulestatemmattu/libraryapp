import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { Request } from '../interfaces/Request';

const baseUrl = apiBaseUrl + '/requests';

const sendBookRequest = async (request: Request) => {
  const response = await axios.post(baseUrl, request);
  return response.data;
};

const deleteBookRequest = async (id: number) => {
  await axios.delete(`${baseUrl}/${id}`);
};

export { sendBookRequest, deleteBookRequest };
