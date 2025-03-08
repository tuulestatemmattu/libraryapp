import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddBookForm from '../AddBookForm/AddBookForm';
import IsbnPage from '../IsbnPage/IsbnPage';
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
import useMainStore from '../../hooks/useMainStore';
import useRequireAdmin from '../../hooks/useRequireAdmin';

type ViewOpt = 'form' | 'scan' | 'isbn';
type initialValues = CreatedBook | null;

const AddBooksPage = () => {
  useRequireAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const addBookToStore = useMainStore((state) => state.addBook);
  const updateBookInStore = useMainStore((state) => state.updateBook);

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
      if (addedBook.isbn === book.isbn) {
        updateBookInStore(addedBook);
      } else {
        addBookToStore(addedBook);
      }
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
