import { useState } from 'react';

import { Chip, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Modal from '@mui/material/Modal';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { FetchedBook } from '../../interfaces/Book';
import BookOverview from '../BookOverview/BookOverview';

import './BookCard.css';

interface BookCardProps {
  book: FetchedBook;
  loading?: boolean;
}

type Status = 'late' | 'borrowed' | 'available' | 'ready' | 'reserved' | 'unavailable';

const BookCard = ({ book, loading }: BookCardProps) => {
  const [open, setOpen] = useState(false);
  /* TODO: When backend returns return date delete calc code */
  const returnDate = book.borrowedByMe
    ? new Date(new Date(book.lastBorrowedDate).getTime() + 86400000 * 30)
    : new Date(0);

  let status: Status = 'available';
  if (book.borrowedByMe) {
    if (returnDate.getTime() - new Date().getTime() < 0) {
      status = 'late';
    } else {
      status = 'borrowed';
    }
  } else if (book.queuedByMe) {
    if (book.queueTime === 0) {
      status = 'ready';
    } else {
      status = 'reserved';
    }
  } else {
    status = book.copiesAvailable - book.queueSize > 0 ? 'available' : 'unavailable';
  }

  const getPlaceholderSVG = (book: FetchedBook) => {
    const firstLetter = book.title ? book.title.charAt(0).toUpperCase() : '?';

    const generateColorFromISBN = (isbn: string) => {
      let hash = 0;
      for (let i = 0; i < isbn.length; i++) {
        hash = isbn.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);
      return hue;
    };

    return `data:image/svg+xml;utf8,
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
        <rect width="100%" height="100%" fill="hsl(${generateColorFromISBN(book.isbn)}, 80%, 75%)"/>
        <rect x="0" y="0" width="30" height="100%" fill="hsl(${generateColorFromISBN(book.isbn)}, 60%, 55%)"/>

        <defs>
          <filter id="textShadow">
            <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="black" flood-opacity="0.5"/>
          </filter>
        </defs>


        <text x="115" y="150" font-size="110" fill="white" font-family="Arial" font-weight="bold" text-anchor="middle" dominant-baseline="middle" filter="url(%23textShadow)">
          ${firstLetter}
        </text>
      </svg>`;
  };

  return (
    <Card className="book-card">
      <CardActionArea className="book-card-action" onClick={() => setOpen(true)}>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '7.5%',
            paddingLeft: '7.5%',
            paddingRight: '7.5%',
          }}
        >
          {loading ? (
            <Skeleton className="book-card-skeleton" />
          ) : (
            <CardMedia
              component="img"
              src={book.imageLink ? book.imageLink : getPlaceholderSVG(book)}
              alt="image"
              className="book-card-image"
            />
          )}
          <Paper elevation={5}>
            <Chip className="book-card-chip" size="small" color={status} label={status} />
          </Paper>
        </Box>
        <CardContent className="book-card-content">
          {loading ? (
            <>
              <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '80%', height: '100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
            </>
          ) : (
            <>
              <Typography variant="h5" component="div" className="book-title">
                {book.title}
              </Typography>
              <Typography gutterBottom variant="body2" component="div" className="book-authors">
                {book.authors}
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          zIndex: 1500,
        }}
      >
        <BookOverview book={book} setOpen={setOpen} />
      </Modal>
    </Card>
  );
};

export default BookCard;
