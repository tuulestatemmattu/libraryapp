import BarcodeScanner from '../BarcodeScanner';
import { Backdrop } from '@mui/material';
import { useEffect, useState } from 'react';
import BookCard from '../BookCard/BookCard';
import { FetchedBook } from '../../interfaces/Book';
import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';

import '../../style.css';
import './ScanPage.css';

interface ScanPageProps {
  books: FetchedBook[];
}

const placeholderBook: FetchedBook = {
  id: 1,
  title: 'placeholder',
  authors: 'placeholder',
  isbn: '1234567890',
  publishedDate: '2000',
  description: '',
  location: 'Helsinki',
  borrowedByMe: false,
  available: false,
  lastBorrowedDate: new Date(),
};

const ScanPage = ({ books }: ScanPageProps) => {
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
        <div>
          <Backdrop
            open={open}
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                setOpen(false);
                setIsbn(null);
              }
            }}
            sx={{
              zIndex: 1500,
            }}
          >
            <BookCard book={scannedBook} setOpen={setOpen} />
          </Backdrop>
        </div>
      </div>
    </article>
  );
};

export default ScanPage;
