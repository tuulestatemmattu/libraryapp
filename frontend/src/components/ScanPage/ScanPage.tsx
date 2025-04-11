import { useEffect, useState } from 'react';

import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';

import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../hooks/useMainStore';
import { FetchedBook } from '../../interfaces/Book';
import BarcodeScanner from '../BarcodeScanner';
import BookModal from '../BookModal/BookModal';

import '../../style.css';
import './ScanPage.css';

interface ScanPageProps {
  borderColor?: string;
}

const ScanPage = ({ borderColor }: ScanPageProps) => {
  const theme = useTheme();
  const books = useMainStore((state) => state.books);
  const [open, setOpen] = useState(false);
  const [scannedBook, setScannedBook] = useState<FetchedBook | null>(null);
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
          <div
            className="scan-overlay"
            style={{
              boxShadow: `0 0 0 5000px ${theme.palette.componentBack.dark}`,
              borderRight: `2px solid ${borderColor ?? theme.palette.primary.light}`,
              borderLeft: `2px solid ${borderColor ?? theme.palette.primary.light}`,
            }}
          ></div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          zIndex: 1500,
        }}
      >
        {scannedBook ? <BookModal book={scannedBook} setOpen={setOpen} /> : <></>}
      </Modal>
    </article>
  );
};

export default ScanPage;
