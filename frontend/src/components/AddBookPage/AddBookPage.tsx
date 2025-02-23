import { useState } from 'react';
import AddBookForm from '../../AddBookForm/AddBookForm';
import IsbnPage from '../IsbnPage';
import BarcodeScanner from '../BarcodeScanner';
import getBookFromIsbn from '../../services/isbn';
import { addBook } from '../../services/book';
import { CreatedBook } from '../../interfaces/Book';
import { Button, ButtonGroup } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import TagIcon from '@mui/icons-material/Tag';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import '../../style.css';
import './AddBookPage.css';

type ViewOpt = 'form' | 'scan' | 'isbn';
type initialValues = CreatedBook | null;

const AddBooksPage = () => {
  const [view, setView] = useState<ViewOpt>('form');
  const [book, setBook] = useState<initialValues>(null);
  const [isbn, _] = useState<string>('');
  const { showNotification } = useNotification();

  const handleIsbnSubmit = async (isbn: string) => {
    const book = await getBookFromIsbn(isbn);
    if (book) {
      setBook(book);
      setView('form');
    } else {
      showNotification('The given ISBN not found in the database. Please check the input', 'info');
    }
  };

  const handleManualSubmit = async (book: CreatedBook) => {
    try {
      await addBook(book);
      setBook(null);
      return { status: 201 };
    } catch (error) {
      console.error('Error adding book', error);
      setBook(book);
      return { status: 400 };
    }
  };

  const handleScannerSubmit = async (isbn: string): Promise<boolean> => {
    const book = await getBookFromIsbn(isbn);
    if (book) {
      setBook(book);
    } else {
      setBook({
        isbn,
        title: '',
        authors: '',
        publishedDate: '',
        description: '',
        location: 'Helsinki',
      });
    }
    setView('form');
    return false; // tels the scanner to not restart
  };

  const Content = () => {
    if (view === 'form') {
      return <AddBookForm onSubmit={handleManualSubmit} initialValues={book} />;
    }
    if (view === 'isbn') {
      return <IsbnPage isbnCallHandler={handleIsbnSubmit} isbn_code={isbn} />;
    }
    if (view === 'scan') {
      return <BarcodeScanner isbnHandler={handleScannerSubmit} />;
    }
  };

  return (
    <article>
      <div className="center">
        <ButtonGroup variant="contained" className="button-group">
          <Button className="button" variant="contained" onClick={() => setView('form')}>
            <TextFieldsIcon className="icon" /> form
          </Button>
          <Button className="button" variant="contained" onClick={() => setView('isbn')}>
            <TagIcon className="icon" /> isbn
          </Button>
          <Button className="button" variant="contained" onClick={() => setView('scan')}>
            <QrCodeScannerIcon className="icon" /> scan
          </Button>
        </ButtonGroup>
      </div>
      <div className="book-content">
        <Content />
      </div>
    </article>
  );
};

export default AddBooksPage;
