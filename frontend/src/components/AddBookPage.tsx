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

  const handleIsbnSubmit = async (isbn: string) => {
    const book: BookInterface = await getBookFromIsbn(isbn);
    setBook(book);
    setView('form');
  };

  const handleManualSubmit = async (book: BookInterface) => {
    const addedBook: BookInterface = await addBook(book);
    setBook(addedBook);
  }

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
      <Content />
    </div>
  );
};

export default AddBooksPage;
