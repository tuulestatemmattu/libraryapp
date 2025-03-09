import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/tags';
import { getToken } from '../util/getToken';
import { CreatedTag } from '../interfaces/Tags';

const getTags = async () => {
  const token = getToken();

  const response = await axios.get(baseUrl, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

const addTag = async (tag: CreatedTag) => {
  const token = getToken();

  const response = await axios.post(baseUrl, tag, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export { getTags, addTag };
