import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { CreatedTag, FetchedTag } from '../interfaces/Tags';

const baseUrl = apiBaseUrl + '/tags';

const getTags = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const addTag = async (tag: CreatedTag) => {
  const response = await axios.post(baseUrl, tag);
  return response.data;
};

const updateTag = async (tag: FetchedTag) => {
  const response = await axios.put(`${baseUrl}/${tag.id}`, tag);
  return response.data;
};

const deleteTag = async (id: number) => {
  await axios.delete(`${baseUrl}/${id}`);
};

export { getTags, addTag, updateTag, deleteTag };
