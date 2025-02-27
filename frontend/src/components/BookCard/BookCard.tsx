import './BookCard.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Modal } from '@mui/material';
import { useState } from 'react';
import BookCard from '../BookOverview/BookOverview';
import { FetchedBook } from '../../interfaces/Book';
import { Box } from '@mui/material';
import { StarBorder, Bookmark, HighlightOff, CheckCircleOutline } from '@mui/icons-material';

interface BookListItemProps {
  book: FetchedBook;
}

const BookListItem = ({ book }: BookListItemProps) => {
  const [open, setOpen] = useState(false);

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
          <CardMedia
            component="img"
            src={book.imageLink ? book.imageLink : getPlaceholderSVG({ book })}
            alt="image"
            className="book-card-image"
          />
          <div className="card-chip-positioner">
            <div className="card-chip-container">
              <Bookmark
                className={`card-chip base ${book.copiesAvailable > 0 ? 'available' : book.borrowedByMe ? 'mine' : 'unavailable'}`}
              />
              <div className="card-chip-icon-container">
                {book.borrowedByMe ? (
                  <StarBorder className="card-chip icon mine" />
                ) : book.copiesAvailable > 0 ? (
                  <CheckCircleOutline className="card-chip icon available" />
                ) : (
                  <HighlightOff className="card-chip icon unavailable" />
                )}
              </div>
            </div>
          </div>
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          zIndex: 1500,
        }}
      >
        <BookCard book={book} setOpen={setOpen} />
      </Modal>
    </Card>
  );
};

export default BookListItem;
