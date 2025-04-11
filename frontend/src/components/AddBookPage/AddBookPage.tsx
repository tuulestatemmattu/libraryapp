import { useState } from 'react';

import { Modal } from '@mui/material';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../hooks/useMainStore';
import useRequireAdmin from '../../hooks/useRequireAdmin';
import { CreatedBook } from '../../interfaces/Book';
import { addBook } from '../../services/book';
import { getInfoFromIsbn } from '../../services/isbn';
import AddBookForm from '../AddBookForm/AddBookForm';
import BarcodeScanner from '../BarcodeScanner';

import '../../style.css';
import './AddBookPage.css';

interface AddBookPageProps {
  borderColor?: string;
}

type initialValues = CreatedBook | null;

const AddBookPage = ({ borderColor }: AddBookPageProps) => {
  const theme = useTheme();
  useRequireAdmin();
  const addOrUpdateBook = useMainStore((state) => state.addOrUpdateBook);

  const [book, setBook] = useState<initialValues>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const { showNotification } = useNotification();

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
    await handleIsbnSearch(isbn);
    setScannerOpen(false);
    return false; // Prevent scanner restart
  };

  const handleIsbnSearch = async (isbn: string): Promise<void> => {
    const book = await getInfoFromIsbn(isbn);
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
      showNotification(
        'The given ISBN was not found in the database. Please check the input.',
        'info',
      );
    }
  };

  const Content = () => {
    return <AddBookForm onSubmit={handleManualSubmit} onIsbnSearch={handleIsbnSearch} initialValues={book} />
  };

  return (
    <article>
      <h2>Add a new book</h2>
      <div className="center">
        <Button onClick={() => setScannerOpen(true)}>Scan ISBN</Button>
      </div>
      <div className={'book-content'}>
        <Content />
      </div>
      <Modal open={scannerOpen} onClose={() => setScannerOpen(false)}>
        <div className='scan-box'>
          <BarcodeScanner isbnHandler={handleScannerSubmit} />
          <div
            className="scan-overlay"
            style={{
              boxShadow: `0 0 0 5000px ${theme.palette.componentBack.dark}`,
              borderRight: `2px solid ${borderColor ?? theme.palette.primary.light}`,
              borderLeft: `2px solid ${borderColor ?? theme.palette.primary.light}`,
            }}
          ></div>
        </div>
      </Modal>
    </article>
  );
};

export default AddBookPage;
