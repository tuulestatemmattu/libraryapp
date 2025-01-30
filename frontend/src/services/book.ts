import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/books';
import { BookInterface } from '../interfaces/Book';

const addBookFromManualEntry = async (book: BookInterface): Promise<BookInterface> => {
  const resultData = (await axios.post(baseUrl, book)).data;
  return resultData;
};

export default addBookFromManualEntry; // rename to addBook since it's not just for manual entry
