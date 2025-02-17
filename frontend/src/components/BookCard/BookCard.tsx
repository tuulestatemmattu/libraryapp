import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface BookListItemProps {
  book: {
    id: number;
    title: string;
    authors: string;
    isbn: string;
    description: string;
    publishedDate: string;
  };
}

const BookCard: React.FC<BookListItemProps> = ({ book }) => {
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
      <CardMedia
        component="img"
        sx={{ height: '50%', objectFit: 'contain', paddingTop: 2 }}
        image="https://m.media-amazon.com/images/I/91VvijsCGIL._AC_UF894,1000_QL80_.jpg"
        alt="book cover"
      />

      {/* Middle: Book Information */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // prevents overflowing content
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
            <Button
              size="small"
              variant="contained"
              sx={{ fontSize: 10, marginBottom: 1, marginLeft: 1 }}
            >
              Borrow
            </Button>
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
