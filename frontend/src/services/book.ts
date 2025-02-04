import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/books';
import { BookInterface } from '../interfaces/Book';

const addBook = async (book: BookInterface): Promise<{ data: BookInterface; status: number }> => {
  const response = await axios.post(baseUrl, book);
  return { data: response.data, status: response.status };
};

export default addBook;
