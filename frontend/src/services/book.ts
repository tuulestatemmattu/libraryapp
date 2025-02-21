import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/books';
import { CreatedBook } from '../interfaces/Book';
import { getToken } from '../util/getToken';

const addBook = async (book: CreatedBook): Promise<CreatedBook> => {
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

const getDetails = async (id: number) => {
  const token = getToken();
  const response = await axios.get(`${baseUrl}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const borrowBook = async (id: number) => {
  const token = getToken();
  const response = await axios.put(
    `${baseUrl}/borrow/${id}`,
    {}, //PUT pyynnöt tarvii tähän tyhjän objektin, koska headerit on vasta kolmas parametri
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

const returnBook = async (id: number) => {
  const token = getToken();
  const response = await axios.put(
    `${baseUrl}/return/${id}`,
    {}, //PUT pyynnöt tarvii tähän tyhjän objektin, koska headerit on vasta kolmas parametri
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export { addBook, getBooks, getDetails, borrowBook, returnBook };
