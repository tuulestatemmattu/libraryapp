import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { CreatedBook } from '../interfaces/Book';
import { getToken } from '../util/getToken';

const baseUrl = apiBaseUrl + '/isbn';

const getInfoFromIsbn = async (isbn: string): Promise<CreatedBook | null> => {
  const token = getToken();

  try {
    const response = await axios.post(
      baseUrl,
      { isbn: isbn },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching book fron isbn', error);
    return null;
  }
};

export default getInfoFromIsbn;
