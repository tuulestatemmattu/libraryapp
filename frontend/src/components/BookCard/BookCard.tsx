import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FetchedBook } from '../../interfaces/Book';
import { SyntheticEvent } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

interface props {
  book: FetchedBook;
}

const BookCard = ({ book }: props) => {
  const borrowBook = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('borrowing');
  };

  const returnBook = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('return');
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
        <Button sx={{ alignSelf: 'flex-start', minWidth: 0 }}>
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
          image="https://m.media-amazon.com/images/I/91VvijsCGIL._AC_UF894,1000_QL80_.jpg"
          alt="book cover"
        />
      </Box>

      {/* Middle: Book Information */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // prevents overflowing content
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
                onClick={returnBook}
              >
                Return
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                sx={{ fontSize: 10, marginBottom: 1, marginLeft: 1 }}
                onClick={borrowBook}
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
