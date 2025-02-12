import { useState } from 'react';
import AddBookForm from './AddBookForm';
import IsbnPage from './IsbnPage';
import BarcodeScanner from './BarcodeScanner';
import getBookFromIsbn from '../services/isbn';
import { addBook } from '../services/book';
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
  const [isbn, _] = useState<string>('');

  const handleIsbnSubmit = async (isbn: string) => {
    const book: BookInterface = await getBookFromIsbn(isbn);
    setBook(book);
    setView('form');
  };

  const handleManualSubmit = async (book: BookInterface) => {
    const addedBook: BookInterface = await addBook(book);
    setBook(addedBook);
  };

  const handleScannerSubmit = async (isbn: string) => {
    const book: BookInterface = await getBookFromIsbn(isbn);
    if (book) {
      setBook(book);
    } else {
      setBook({ isbn, title: '', authors: '', publishedDate: '', description: '' });
    }
    setView('form');
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
