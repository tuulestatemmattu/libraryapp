import './BookListItem.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, Chip } from '@mui/material';
import { Cancel, CheckCircle } from '@mui/icons-material';

interface BookListItemProps {
  book: {
    id: number;
    title: string;
    authors: string;
    isbn: string;
    description: string;
    publishedDate: string;
    location: string;
    available: boolean;
  };
}

const BookListItem = ({ book }: BookListItemProps) => {
  const isAvailable = book.available;

  return (
    <Card variant="outlined" className="book-card">
      <CardActionArea className="book-card-action">
      <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            src="https://m.media-amazon.com/images/I/91VvijsCGIL._AC_UF894,1000_QL80_.jpg"
            alt="image"
            className="book-card-image"
          />
          <Chip
            label={isAvailable ? 'Avaible' : 'Unavaible'}
            icon={
              isAvailable ? (
                <CheckCircle />
              ) : (
                <Cancel />
              )
            }
            className='card-chip'
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: isAvailable ? 'green' : 'red',
              color: 'white',
              '.MuiChip-icon': {
                color: 'white'
              },
            }}
          />
        </Box>
        <CardContent className="book-card-content">
          <Typography gutterBottom variant="h5" component="div" className="book-title">
            {book.title}
          </Typography>
          <Typography gutterBottom variant="body2" component="div" className="book-authors">
            {book.authors}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BookListItem;
