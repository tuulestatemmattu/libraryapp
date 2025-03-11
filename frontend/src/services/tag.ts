import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { CreatedTag, FetchedTag } from '../interfaces/Tags';
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

const updateTag = async (tag: FetchedTag) => {
  const token = getToken();
  const response = await axios.put(`${baseUrl}/${tag.id}`, tag, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

const deleteTag = async (id: number) => {
  const token = getToken();
  await axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { getTags, addTag, updateTag, deleteTag };
