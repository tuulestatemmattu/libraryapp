import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/books';
import { BookInterface } from '../interfaces/Book';

const addBook = async (book: BookInterface): Promise<BookInterface> => {
  const resultData = (await axios.post(baseUrl, book)).data;
  return resultData;
};

export default addBook;
