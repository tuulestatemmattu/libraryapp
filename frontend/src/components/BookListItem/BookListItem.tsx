import './BookListItem.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { Backdrop } from '@mui/material';
import { useState } from 'react';
import BookCard from '../BookCard/BookCard';
import { FetchedBook } from '../../interfaces/Book';
import { Box } from '@mui/material';
import { Cancel, CheckCircle, BlindsClosed, Bookmark } from '@mui/icons-material';

interface BookListItemProps {
  book: FetchedBook;
}

const BookListItem = ({ book }: BookListItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Card variant="outlined" className="book-card">
      <CardActionArea className="book-card-action" onClick={() => setOpen(true)}>
        <Box>
          <CardMedia
            component="img"
            src={
              book.imageLink
                ? book.imageLink
                : 'https://m.media-amazon.com/images/I/91VvijsCGIL._AC_UF894,1000_QL80_.jpg'
            }
            alt="image"
            className="book-card-image"
          />
          <div className="card-chip-positioner">
            <div className="card-chip-container">
              <Bookmark
                className={`card-chip base ${book.available ? 'available' : book.borrowedByMe ? 'mine' : 'unavailable'}`}
              />
              <div className="card-chip-icon-container">
                {book.available ? (
                  <CheckCircle className="card-chip icon" />
                ) : book.borrowedByMe ? (
                  <BlindsClosed className="card-chip icon" />
                ) : (
                  <Cancel className="card-chip icon" />
                )}
              </div>
            </div>
          </div>
        </Box>
        <CardContent className="book-card-content" component="div">
          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.authors}</div>
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
