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
import { getPlaceholderSVG } from '../../util/svgUtils';
import BookModal from '../BookModal/BookModal';

import './BookCard.css';

interface BookCardProps {
  book: FetchedBook;
  loading?: boolean;
}

const BookCard = ({ book, loading }: BookCardProps) => {
  const [open, setOpen] = useState(false);

  const getStatusChipLabel = (book: FetchedBook): string => {
    if (book.status === 'borrowed') {
      const daysLeft = book.daysLeft.toString() + ' day' + (book.daysLeft === 1 ? '' : 's');
      return daysLeft;
    } else {
      return book.status;
    }
  };

  return (
    <Card className="book-card" data-testid={`book-card-${book.isbn}`}>
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
              src={book.imageLink ?? getPlaceholderSVG(book)}
              alt="image"
              className="book-card-image"
            />
          )}
          <Paper elevation={5}>
            <Chip
              className="book-card-chip"
              size="small"
              color={book.status}
              label={getStatusChipLabel(book)}
            />
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <BookModal book={book} setOpen={setOpen} />
        </Box>
      </Modal>
    </Card>
  );
};

export default BookCard;
