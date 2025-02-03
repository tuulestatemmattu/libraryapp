import { useState } from 'react';
import AddBookForm from './AddBookForm';
import IsbnPage from './IsbnPage';
import getBookFromIsbn from '../services/isbn';
import addBook from '../services/book';
import { BookInterface } from '../interfaces/Book';
import { Button, ButtonGroup } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import TagIcon from '@mui/icons-material/Tag';
import TextFieldsIcon from '@mui/icons-material/TextFields';

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
      <ButtonGroup variant="contained">
        <Button variant="contained" onClick={() => setView('form')}>
          <TextFieldsIcon style={{ marginRight: 5 }} /> form
        </Button>
        <Button variant="contained" onClick={() => setView('isbn')}>
          <TagIcon style={{ marginRight: 5 }} /> isbn
        </Button>
        <Button variant="contained" onClick={() => setView('scan')}>
          <QrCodeScannerIcon style={{ marginRight: 5 }} /> scan
        </Button>
      </ButtonGroup>
      <Content />
    </div>
  );
};

export default AddBooksPage;
