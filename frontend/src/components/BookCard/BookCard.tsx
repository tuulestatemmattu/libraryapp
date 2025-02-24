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
          image={
            book.imageLink
              ? book.imageLink
              : 'https://m.media-amazon.com/images/I/91VvijsCGIL._AC_UF894,1000_QL80_.jpg'
          }
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
