import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { AdminViewBook, CreatedBook, FetchedBook } from '../interfaces/Book';

const baseUrl = apiBaseUrl + '/books';

const addBook = async (book: CreatedBook): Promise<FetchedBook> => {
  const response = await axios.post(baseUrl, book);
  return response.data;
};

const getBooks = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const updateBook = async (book: AdminViewBook) => {
  const response = await axios.put(`${baseUrl}/edit/${book.id}`, book);
  return response.data;
};

const deleteBook = async (id: number) => {
  await axios.delete(`${baseUrl}/${id}`);
};

const getDetails = async (id: number) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const borrowBook = async (id: number) => {
  const response = await axios.put(`${baseUrl}/borrow/${id}`);
  return response.data;
};

const returnBook = async (id: number) => {
  const response = await axios.put(`${baseUrl}/return/${id}`);
  return response.data;
};

const getBorrows = async () => {
  const response = await axios.get(`${baseUrl}/borrows`);
  return response.data;
};

const addBookToQueue = async (id: number) => {
  const response = await axios.put(`${baseUrl}/queue/${id}`);
  return response.data;
};

const removeBookFromQueue = async (id: number) => {
  const response = await axios.delete(`${baseUrl}/queue/${id}`);
  return response.data;
};

export {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
  getDetails,
  borrowBook,
  returnBook,
  getBorrows,
  addBookToQueue,
  removeBookFromQueue,
};
