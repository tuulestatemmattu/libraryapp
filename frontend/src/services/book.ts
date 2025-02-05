import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/books';
import { BookInterface } from '../interfaces/Book';

const addBook = async (book: BookInterface): Promise<BookInterface> => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  const resultData = (
    await axios.post(baseUrl, book, { headers: { Authorization: `Bearer ${token}` } })
  ).data;
  return resultData;
};

export default addBook;
