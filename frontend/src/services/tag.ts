import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { CreatedTag } from '../interfaces/Tags';
import { getToken } from '../util/getToken';

const baseUrl = apiBaseUrl + '/tags';

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
