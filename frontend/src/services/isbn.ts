import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { CreatedBook } from '../interfaces/Book';

const baseUrl = apiBaseUrl + '/isbn';

const getInfoFromIsbn = async (isbn: string): Promise<CreatedBook | null> => {
  try {
    const response = await axios.post(baseUrl, { isbn: isbn });
    return response.data;
  } catch (error) {
    console.error('Error fetching book fron isbn', error);
    return null;
  }
};

const searchBooks = async (title: string, author: string, isbn: string) => {
  try {
    const response = await axios.post(`${baseUrl}/search`, { title, author, isbn });
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export { getInfoFromIsbn, searchBooks };
