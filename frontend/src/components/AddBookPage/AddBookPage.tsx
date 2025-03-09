import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import TagIcon from '@mui/icons-material/Tag';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../hooks/useMainStore';
import useRequireAdmin from '../../hooks/useRequireAdmin';
import { CreatedBook } from '../../interfaces/Book';
import { addBook } from '../../services/book';
import getBookFromIsbn from '../../services/isbn';
import AddBookForm from '../AddBookForm/AddBookForm';
import BarcodeScanner from '../BarcodeScanner';
import IsbnPage from '../IsbnPage/IsbnPage';

import '../../style.css';
import './AddBookPage.css';

type ViewOpt = 'form' | 'scan' | 'isbn';
type initialValues = CreatedBook | null;

const AddBooksPage = () => {
  useRequireAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const addOrUpdateBook = useMainStore((state) => state.addOrUpdateBook);

  const queryParams = new URLSearchParams(location.search);
  const viewParam = queryParams.get('view') as ViewOpt;

  const [view, setView] = useState<ViewOpt>(viewParam || 'form');
  const [book, setBook] = useState<initialValues>(null);
  const { showNotification } = useNotification();

  const changeView = (newView: ViewOpt) => {
    setView(newView);
    navigate(`/addBook?view=${newView}`, { replace: true });
  };

  useEffect(() => {
    if (viewParam) {
      setView(viewParam);
    }
  }, [viewParam]);

  const handleIsbnSubmit = async (isbn: string) => {
    const book = await getBookFromIsbn(isbn);
    if (book) {
      setBook(book);
      changeView('form'); // Update view
    } else {
      showNotification(
        'The given ISBN was not found in the database. Please check the input.',
        'info',
      );
    }
  };

  const handleManualSubmit = async (book: CreatedBook) => {
    try {
      const addedBook = await addBook(book);
      addOrUpdateBook(addedBook);
      showNotification('Book added successfully', 'success');
      setBook(null);
      return { status: 201 };
    } catch (error) {
      console.error('Error adding book', error);
      setBook(book);
      showNotification('Failed to add book', 'error');
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
        tags: [],
        copies: 1,
      });
    }
    changeView('form'); // Switch back to form after scanning
    return false; // Prevent scanner restart
  };

  const Content = () => {
    if (view === 'form') {
      return <AddBookForm onSubmit={handleManualSubmit} initialValues={book} />;
    }
    if (view === 'isbn') {
      return <IsbnPage isbnHandler={handleIsbnSubmit} />;
    }
    if (view === 'scan') {
      return <BarcodeScanner isbnHandler={handleScannerSubmit} />;
    }
  };

  return (
    <article>
      <div className="center">
        <ButtonGroup variant="contained" className="button-group">
          <Button className="button" variant="contained" onClick={() => changeView('form')}>
            <TextFieldsIcon className="icon" /> Form
          </Button>
          <Button className="button" variant="contained" onClick={() => changeView('isbn')}>
            <TagIcon className="icon" /> ISBN
          </Button>
          <Button className="button" variant="contained" onClick={() => changeView('scan')}>
            <QrCodeScannerIcon className="icon" /> Scan
          </Button>
        </ButtonGroup>
      </div>
      <div className={`book-content ${view === 'scan' ? 'scan' : ''}`}>
        <Content />
      </div>
    </article>
  );
};

export default AddBooksPage;
