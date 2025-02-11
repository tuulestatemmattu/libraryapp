import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/books';
import { BookInterface } from '../interfaces/Book';
import { getToken } from '../util/getToken';

const addBook = async (book: BookInterface): Promise<BookInterface> => {
  const token = getToken();

  const response = await axios.post(baseUrl, book, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

const getBooks = async () => {
  const token = getToken();
  const response = await axios.get(baseUrl, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export { addBook, getBooks };
