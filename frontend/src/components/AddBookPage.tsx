import { useState } from 'react';
import AddBookForm from './AddBookForm';
import IsbnPage from './IsbnPage';
import BarcodeScanner from './BarcodeScanner';
import getBookFromIsbn from '../services/isbn';
import addBook from '../services/book';
import { BookInterface } from '../interfaces/Book';

type ViewOpt = 'form' | 'scan' | 'isbn';
type initialValues = BookInterface | null;

const AddBooksPage = () => {
  const [view, setView] = useState<ViewOpt>('form');
  const [book, setBook] = useState<initialValues>(null);
  const [isbn, setIsbn] = useState<string>('');

  const handleIsbnSubmit = async (isbn: string) => {
    const book: BookInterface = await getBookFromIsbn(isbn);
    setBook(book);
    setView('form');
  };

  const handleManualSubmit = async (book: BookInterface) => {
    const addedBook: BookInterface = await addBook(book);
    setBook(addedBook);
  };

  const handleScannerSubmit = (isbn: string) => {
    setIsbn(isbn);
    setView('isbn');
  };

  const Content = () => {
    if (view == 'form') {
      return <AddBookForm onSubmit={handleManualSubmit} initialValues={book} />;
    }
    if (view == 'isbn') {
      return <IsbnPage isbnCallHandler={handleIsbnSubmit} isbn_code={isbn} />;
    }
    if (view == 'scan') {
      return <BarcodeScanner isbnHandler={handleScannerSubmit} />;
    }
  };

  return (
    <div>
      <h2>On this page you can add books to the application.</h2>
      <button onClick={() => setView('form')}>form</button>
      <button onClick={() => setView('isbn')}>isbn</button>
      <button onClick={() => setView('scan')}>scan</button>
      <Content />
    </div>
  );
};

export default AddBooksPage;
