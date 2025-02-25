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
import { Box, Chip } from '@mui/material';
import { Cancel, CheckCircle } from '@mui/icons-material';

interface BookListItemProps {
  book: FetchedBook;
}

const BookListItem = ({ book }: BookListItemProps) => {
  const [open, setOpen] = useState(false);

  const isAvailable = book.available;
  const BorrowedByMe = book.borrowedByMe;

  const getPlaceholderSVG = ({ book }: BookListItemProps) => {
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
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 -20 200 300">
        <rect width="100%" height="100%" fill="hsl(${generateColorFromISBN(book.isbn)}, 80%, 75%)"/>
        <rect x="0" y="0" width="30" height="100%" fill="hsl(${generateColorFromISBN(book.isbn)}, 60%, 55%)"/>

        <defs>
          <filter id="textShadow">
            <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="black" flood-opacity="0.5"/>
          </filter>
        </defs>


        <text x="115" y="135" font-size="110" fill="white" font-family="Arial" font-weight="bold" text-anchor="middle" dominant-baseline="middle" filter="url(%23textShadow)">
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
          <CardMedia
            component="img"
            src={book.imageLink ? book.imageLink : getPlaceholderSVG({ book })}
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
