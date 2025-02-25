import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FetchedBook } from '../../interfaces/Book';
import ClearIcon from '@mui/icons-material/Clear';
import { borrowBook, returnBook } from '../../services/book';
import useMainStore from '../../hooks/useMainStore';

interface props {
  book: FetchedBook;
  setOpen: (open: boolean) => void;
}

const BookCard = ({ book, setOpen }: props) => {
  const updateBook = useMainStore((state) => state.updateBook);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBorrow = async (id: number) => {
    try {
      const newBook = await borrowBook(id);
      updateBook(newBook);
    } catch (error) {
      console.error('Failed to borrow the book:', error);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      const newBook = await returnBook(id);
      updateBook(newBook);
    } catch (error) {
      console.error('Failed to borrow the book:', error);
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
    <Card
      sx={{
        width: '85%',
        height: '85vh',
        margin: 'auto',
        my: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top: Book Cover */}
      <Box
        sx={{
          flexDirection: 'row',
          display: 'flex',
          height: '60%',
        }}
      >
        <Button sx={{ alignSelf: 'flex-start', minWidth: 0 }} onClick={handleClose}>
          <ClearIcon fontSize="small" />
        </Button>
        <CardMedia
          component="img"
          sx={{
            height: '100%',
            objectFit: 'contain',
            paddingTop: 2,
            justifySelf: 'center',
            paddingRight: 5,
          }}
          image={book.imageLink ? book.imageLink : getPlaceholderSVG(book)}
          alt="book cover"
        />
      </Box>

      {/* Middle: Book Information */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',

            marginBottom: '10',
          }}
        >
          <Typography gutterBottom variant="h4" component="div" fontSize={15}>
            {book.title}
          </Typography>
          <CardActions sx={{ padding: 0, alignSelf: 'start' }}>
            {book.borrowedByMe ? (
              <Button
                size="small"
                variant="contained"
                sx={{ fontSize: 10, marginBottom: 1, marginLeft: 1 }}
                onClick={() => handleReturn(book.id)}
              >
                Return
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                sx={{ fontSize: 10, marginBottom: 1, marginLeft: 1 }}
                onClick={() => handleBorrow(book.id)}
              >
                Borrow
              </Button>
            )}
          </CardActions>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" fontSize={10}>
          <strong>Author:</strong> {book.authors}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" fontSize={10}>
          <strong>Published:</strong> {book.publishedDate}
        </Typography>
        <Box
          sx={{
            mt: 2,
            flex: 1,
            overflowY: 'auto',
            pr: 1, // space for scrollbar
          }}
        >
          <Typography variant="body1" fontSize={10}>
            {book.description}
          </Typography>
        </Box>
      </CardContent>

      {/* Bottom: Action Buttons */}
    </Card>
  );
};

export default BookCard;
