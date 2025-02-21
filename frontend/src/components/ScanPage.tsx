import BarcodeScanner from './BarcodeScanner';
import { Backdrop } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import BookCard from './BookCard/BookCard';
import { FetchedBook } from '../interfaces/Book';

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
  lastBorrowedDate: null,
};

const ScanPage = ({ books }: ScanPageProps) => {
  const [open, setOpen] = useState(false);
  const [scannedBook, setScannedBook] = useState<FetchedBook>(placeholderBook);
  const [isbnFound, setIsbnFound] = useState<string | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      if (isbnFound) {
        const matchingBooks = books.filter((book) => book.isbn === isbnFound);
        if (matchingBooks.length > 0) {
          setScannedBook(matchingBooks[0]);
          setOpen(true);
        }
      } else {
        console.log('book not in database');
      }
    } else {
      isMounted.current = true;
    }
  }, [isbnFound]);

  const isbnHandler = (isbn: string): boolean => {
    setIsbnFound(isbn);
    return true; // tells the scanner to restart after a timeout
  };

  return (
    <div>
      <h2>Borrow books by scanning</h2>
      <BarcodeScanner isbnHandler={isbnHandler} />
      <Backdrop
        open={open}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            setOpen(false);
          }
        }}
        sx={{
          zIndex: 1500,
        }}
      >
        <BookCard book={scannedBook} />
      </Backdrop>
    </div>
  );
};

export default ScanPage;
