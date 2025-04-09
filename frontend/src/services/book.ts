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
  const response = await axios.put(`${baseUrl}/${book.id}`, book);
  return response.data;
};

const deleteBook = async (id: number) => {
  await axios.delete(`${baseUrl}/${id}`);
};

const borrowBook = async (id: number) => {
  const response = await axios.post(`${baseUrl}/${id}/borrow`);
  return response.data;
};

const returnBook = async (id: number) => {
  const response = await axios.post(`${baseUrl}/${id}/return`);
  return response.data;
};

const getBorrows = async () => {
  const response = await axios.get(`${baseUrl}/borrows`);
  return response.data;
};

const addBookToQueue = async (id: number) => {
  const response = await axios.post(`${baseUrl}/${id}/reserve`);
  return response.data;
};

const removeBookFromQueue = async (id: number) => {
  const response = await axios.post(`${baseUrl}/${id}/unreserve`);
  return response.data;
};

const extendBookLoan = async (id: number) => {
  const response = await axios.put(`${baseUrl}/${id}/extend`);
  return response.data;
};

const getQueueEntries = async () => {
  const response = await axios.get(`${baseUrl}/queue`);
  return response.data;
};

const deleteQueueEntry = async (id: number) => {
  await axios.delete(`${baseUrl}/queue/${id}`);
};

export {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getBorrows,
  addBookToQueue,
  removeBookFromQueue,
  extendBookLoan,
  getQueueEntries,
  deleteQueueEntry,
};
