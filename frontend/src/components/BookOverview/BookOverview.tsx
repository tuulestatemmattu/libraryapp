import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import useMainStore from '../../hooks/useMainStore';
import { FetchedBook } from '../../interfaces/Book';
import { borrowBook, returnBook } from '../../services/book';
import ItemsSlider from '../ItemsSlider/ItemsSlider';

import './BookOverview.css';

interface props {
  book: FetchedBook;
  setOpen: (open: boolean) => void;
}

const BookCard = ({ book, setOpen }: props) => {
  const addOrUpdateBook = useMainStore((state) => state.addOrUpdateBook);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBorrow = async (id: number) => {
    try {
      const newBook = await borrowBook(id);
      addOrUpdateBook(newBook);
      handleClose();
    } catch (error) {
      console.error('Failed to borrow the book:', error);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      const newBook = await returnBook(id);
      addOrUpdateBook(newBook);
      handleClose();
    } catch (error) {
      console.error('Failed to return the book:', error);
    }
  };

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
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 -20 200 300">
        <rect width="200" height="260" fill="hsl(${generateColorFromISBN(book.isbn)}, 80%, 75%)" stroke="white" stroke-width="15"/>
        <rect x="8" y="8" width="30" height="245" fill="hsl(${generateColorFromISBN(book.isbn)}, 60%, 55%)"/>

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
    <Card className="book-overview-card">
      {/* Top: Book Cover */}
      <IconButton onClick={handleClose} className="overview-close-button">
        <ClearIcon fontSize="medium" />
      </IconButton>
      <div className="overview-content-container">
        <div className="overview-tophalf-container">
          <div className="overview-topleft-container">
            <Paper className="book-overview-image-container" elevation={5}>
              <CardMedia
                component="img"
                className="book-overview-image"
                image={book.imageLink ? book.imageLink : getPlaceholderSVG(book)}
                alt="book cover"
              />
            </Paper>
            <CardActions sx={{ padding: 0 }}>
              {book.borrowedByMe ? (
                <Button
                  variant="contained"
                  className="book-overview-action-button"
                  onClick={() => handleReturn(book.id)}
                >
                  Return
                </Button>
              ) : book.copiesAvailable > 0 ? (
                <Button
                  variant="contained"
                  className="book-overview-action-button"
                  onClick={() => handleBorrow(book.id)}
                >
                  Borrow
                </Button>
              ) : (
                <div></div>
              )}
            </CardActions>
          </div>
          <CardContent>
            <div className="book-overview-info-container">
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                className="overview-title overview-text"
              >
                {book.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                className="overview-info-text overview-text"
              >
                <strong>Authors:</strong> {book.authors}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                className="overview-info-text overview-text"
              >
                <strong>Published:</strong> {book.publishedDate}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                className="overview-info-text overview-text"
              >
                <strong>Copies available:</strong> {book.copiesAvailable}
              </Typography>
              {/*
              <Typography
                variant="subtitle1"
                color="text.secondary"
                className="overview-info-text overview-text"
              >
                <strong>tags:</strong> scifi
              </Typography>
              */}
            </div>
          </CardContent>
        </div>
        {/* ItemSlider containing tags associated with the book */}
        <CardContent sx={{ pt: 0, pb: 0 }} className="book-tags-slider">
          <ItemsSlider renderButtons={false}>
            {book.tags.map((tag) => (
              <Chip key={tag.id} label={tag.name} size="small" />
            ))}
          </ItemsSlider>
        </CardContent>

        {/* Middle: Book Information */}
        <CardContent className="overview-description-container">
          <Typography variant="body1" className="overview-description overview-text">
            {book.description}
          </Typography>
        </CardContent>
      </div>

      {/* Bottom: Action Buttons */}
    </Card>
  );
};

export default BookCard;
