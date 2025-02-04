import { useState } from 'react';
import AddBookForm from './AddBookForm';
import IsbnPage from './IsbnPage';
import getBookFromIsbn from '../services/isbn';
import addBook from '../services/book';
import { BookInterface } from '../interfaces/Book';

type ViewOpt = 'form' | 'scan' | 'isbn';
type initialValues = BookInterface | null;

const AddBooksPage = () => {
  const [view, setView] = useState<ViewOpt>('form');
  const [book, setBook] = useState<initialValues>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIsbnSubmit = async (isbn: string) => {
    try {
      const book: BookInterface = await getBookFromIsbn(isbn);
      setBook(book);
      setView('form');
      setError(null);
    } catch (error: any) {
      console.error('Error fetching book fron isbn', error);
      if (error.response?.status === 400) {
        setError('The given ISBN appears to be invalid. Please check the input');
      } else {
        setError('An unexpected error occured');
      }
    }
    setTimeout(() => setError(null), 3000);
  };

  const handleManualSubmit = async (book: BookInterface) => {
    try {
      const response = await addBook(book);
      return response;
    } catch (error) {
      console.error('Error adding book:', error);
      return { data: book, status: 500 };
    }
  };

  const Content = () => {
    if (view == 'form') {
      return <AddBookForm onSubmit={handleManualSubmit} initialValues={book} />;
    }
    if (view == 'isbn') {
      return <IsbnPage isbnCallHandler={handleIsbnSubmit} />;
    }
    if (view == 'scan') {
      return <h1 color="red">This area is not yet finished</h1>;
    }
  };

  return (
    <div>
      <h2>On this page you can add books to the application.</h2>
      <button onClick={() => setView('form')}>form</button>
      <button onClick={() => setView('isbn')}>isbn</button>
      <button onClick={() => setView('scan')}>scan</button>
      {error && (
        <div style={{ background: 'red', padding: '10px', marginBottom: '10px' }}>{error}</div>
      )}{' '}
      {/* #TODO: move styling to css mui element for error */}
      <Content />
    </div>
  );
};

export default AddBooksPage;
