import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { Request } from '../interfaces/Request';

const baseUrl = apiBaseUrl + '/requests';

const getBookRequests = async () => {
  const response = await axios.get(baseUrl);
  console.log('Book requests:', response.data);
  return response.data;
};

const sendBookRequest = async (request: Request) => {
  const response = await axios.post(baseUrl, request);
  return response.data;
};

const deleteBookRequest = async (id: number) => {
  await axios.delete(`${baseUrl}/${id}`);
};

const modifyRequestStatus = async (id: number, message: string, status: string) => {
  const response = await axios.put(`${baseUrl}/${id}`, { message, status });
  return response.data;
};

export { getBookRequests, sendBookRequest, deleteBookRequest, modifyRequestStatus };
