import { useState } from 'react';
import AddBookForm from '../AddBookForm';
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
    try {
      const book: CreatedBook = await getBookFromIsbn(isbn);
      setBook(book);
      setView('form');
    } catch (error) {
      console.error('Error fetching book from ISBN', error);
      showNotification('The given ISBN appears to be invalid. Please check the input', 'info');
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

  const handleScannerSubmit = async (isbn: string) => {
    const book: CreatedBook = await getBookFromIsbn(isbn);
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
      <ButtonGroup variant="contained">
        <Button variant="contained" onClick={() => setView('form')}>
          <TextFieldsIcon className="icon" /> form
        </Button>
        <Button variant="contained" onClick={() => setView('isbn')}>
          <TagIcon className="icon" /> isbn
        </Button>
        <Button variant="contained" onClick={() => setView('scan')}>
          <QrCodeScannerIcon className="icon" /> scan
        </Button>
      </ButtonGroup>
      <Content />
    </article>
  );
};

export default AddBooksPage;
