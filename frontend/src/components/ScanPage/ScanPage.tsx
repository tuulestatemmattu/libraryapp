import { useEffect, useState } from 'react';

import Modal from '@mui/material/Modal';

import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../hooks/useMainStore';
import { FetchedBook } from '../../interfaces/Book';
import BarcodeScanner from '../BarcodeScanner';
import BookCard from '../BookOverview/BookOverview';

import '../../style.css';
import './ScanPage.css';

const placeholderBook: FetchedBook = {
  id: 1,
  title: 'placeholder',
  authors: 'placeholder',
  isbn: '1234567890',
  publishedDate: '2000',
  description: '',
  location: 'Helsinki',
  borrowedByMe: false,
  queuedByMe: false,
  copies: 0,
  copiesAvailable: 0,
  lastBorrowedDate: new Date(),
  tags: [],
};

const ScanPage = () => {
  const books = useMainStore((state) => state.books);
  const [open, setOpen] = useState(false);
  const [scannedBook, setScannedBook] = useState<FetchedBook>(placeholderBook);
  const [isbn, setIsbn] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isbn) {
      const matchingBooks = books.filter((book) => book.isbn === isbn);
      if (matchingBooks.length > 0) {
        setScannedBook(matchingBooks[0]);
        setOpen(true);
      } else {
        showNotification('Book was not found in the database', 'info');
      }
    }
  }, [isbn]);

  const isbnHandler = (isbn: string): boolean => {
    setIsbn(isbn);
    return true; // tells the scanner to restart after a timeout
  };

  return (
    <article>
      <div className="center">
        <h2>Borrow books by scanning</h2>
        <div className="scan-content">
          <BarcodeScanner isbnHandler={isbnHandler} />
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          zIndex: 1500,
        }}
      >
        <BookCard book={scannedBook} setOpen={setOpen} />
      </Modal>
    </article>
  );
};

export default ScanPage;
