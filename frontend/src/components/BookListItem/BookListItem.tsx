import './BookListItem.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Backdrop } from '@mui/material';
import { useState } from 'react';
import BookCard from '../BookCard/BookCard';
import { FetchedBook } from '../../interfaces/Book';
//import { getDetails } from '../../services/book';
import { Box, Chip } from '@mui/material';
import { Cancel, CheckCircle } from '@mui/icons-material';

interface BookListItemProps {
  book: FetchedBook;
}

const BookListItem = ({ book }: BookListItemProps) => {
  const [open, setOpen] = useState(false);

  const isAvailable = book.available;
  const BorrowedByMe = book.borrowedByMe;

  return (
    <Card variant="outlined" className="book-card">
      <CardActionArea className="book-card-action" onClick={() => setOpen(true)}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            src="https://m.media-amazon.com/images/I/91VvijsCGIL._AC_UF894,1000_QL80_.jpg"
            alt="image"
            className="book-card-image"
          />
          <Chip
            label={isAvailable ? 'Avaible' : BorrowedByMe ? 'Your book' : 'Unavaible'}
            icon={isAvailable ? <CheckCircle /> : BorrowedByMe ? <CheckCircle /> : <Cancel />}
            className="card-chip"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              fontWeight: 'bold',
              backgroundColor: isAvailable ? 'green' : BorrowedByMe ? 'blue' : 'red',
              color: 'white',
              '.MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        </Box>
        <CardContent className="book-card-content">
          <Typography variant="h5" component="div" className="book-title">
            {book.title}
          </Typography>
          <Typography gutterBottom variant="body2" component="div" className="book-authors">
            {book.authors}
          </Typography>
        </CardContent>
      </CardActionArea>
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
        <BookCard book={book} setOpen={setOpen} />
      </Backdrop>
    </Card>
  );
};

export default BookListItem;
