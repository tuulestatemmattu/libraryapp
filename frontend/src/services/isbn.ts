import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/isbn';
import { CreatedBook } from '../interfaces/Book';
import { getToken } from '../util/getToken';

const getInfoFromIsbn = async (isbn: string): Promise<CreatedBook> => {
  const token = getToken();

  const response = await axios.post(
    baseUrl,
    { isbn: isbn },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export default getInfoFromIsbn;
