import { AxiosError } from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../hooks/useMainStore';
import { FetchedBook } from '../../interfaces/Book';
import {
  addBookToQueue,
  borrowBook,
  extendBookLoan,
  removeBookFromQueue,
  returnBook,
} from '../../services/book';
import { getPlaceholderSVG } from '../../util/svgUtils';
import { ExpandableCollapsable } from '../ExpandableCollapsable/ExpandableCollapsable';
import ItemsSlider from '../ItemsSlider/ItemsSlider';
import BottomRowButtons from './BottomRowButtons/BottomRowButtons';

import './BookModal.css';

interface BookModalProps {
  book: FetchedBook;
  setOpen: (open: boolean) => void;
}

const BookModal = ({ book, setOpen }: BookModalProps) => {
  const addOrUpdateBook = useMainStore((state) => state.addOrUpdateBook);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const daysLeftString =
    Math.abs(book.daysLeft) +
    ' day' +
    (Math.abs(book.daysLeft) == 1 ? ' ' : 's ') +
    (book.daysLeft > 0 ? 'left' : 'ago');
  const returnDateString = `${moment(book.dueDate).format('ddd D.M.')} (${daysLeftString})`;

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

  const handleExtend = async (id: number) => {
    try {
      const newLoan = await extendBookLoan(id);
      console.log('Extended book:', newLoan);
      addOrUpdateBook(newLoan);
      showNotification('Loan extended successfully', 'success');
      handleClose();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification('Failed to extend loan: ' + error.response.data.message, 'error');
      }
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

  const handleAddToQueue = async (id: number) => {
    try {
      const newBook = await addBookToQueue(id);
      addOrUpdateBook(newBook);
      handleClose();
    } catch (error) {
      console.error('Failed to add the book to the queue:', error);
    }
  };

  const handleRemoveFromQueue = async (id: number) => {
    try {
      const newBook = await removeBookFromQueue(id);
      addOrUpdateBook(newBook);
      handleClose();
    } catch (error) {
      console.error('Failed to remove the book from the queue:', error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin?view=books&bookId=${id}`);
  };

  return (
    <Card className="book-modal">
      <Grid container sx={{ m: 1.5, overflowX: 'hidden' }}>
        {/* Book Title and Close Button */}
        <Grid container size={12}>
          <Typography variant="h6" sx={{ pr: 4, pb: 2 }}>
            {book.title}
          </Typography>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 5, right: 5 }}>
            <ClearIcon />
          </IconButton>
        </Grid>

        {/* Book Cover and Book Info */}
        <Grid
          container
          spacing={2}
          sx={{ width: '100%', mb: 1 }}
          direction={isSmallScreen ? 'column' : 'row'}
          alignItems={'flex-start'}
        >
          {/* Book Cover */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <CardMedia
              component="img"
              image={book.imageLink ?? getPlaceholderSVG(book)}
              alt="book cover"
              sx={{
                boxShadow: 5,
                maxWidth: '160px',
                margin: '0 auto',
              }}
            />
          </Grid>

          {/* Book Info */}
          <Grid size={{ xs: 12, sm: 8 }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                <strong>Title:</strong> {book.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                <strong>Authors:</strong> {book.authors}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                <strong>Published:</strong> {book.publishedDate}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                <strong>Copies available:</strong>{' '}
                {Math.max(book.copiesAvailable - book.queueSize, 0) +
                  (book.status == 'ready' ? 1 : 0)}
              </Typography>
              {book.borrowedByMe && (
                <Typography variant="subtitle1" color="text.secondary">
                  <strong>Return date: </strong>
                  {returnDateString}
                </Typography>
              )}
              {book.queuedByMe && (
                <Typography variant="subtitle1" color="text.secondary">
                  <strong>Available in:</strong> {book.queueTime} days
                </Typography>
              )}
            </CardContent>
          </Grid>
        </Grid>

        {/* Tags Slider */}
        <Grid container>
          <CardContent>
            <ItemsSlider renderButtons={false} backgroundColor={theme.palette.componentBack.light}>
              {book.tags.map((tag) => (
                <Chip key={tag.id} label={tag.name} size="small" />
              ))}
            </ItemsSlider>
          </CardContent>
        </Grid>

        {/* Description */}
        {book.description && (
          <Grid container sx={{ my: 1 }}>
            <CardContent>
              <ExpandableCollapsable
                charLimit={100}
                readMoreText={'Read more ▼'}
                readLessText={'Read less ▲'}
                content={book.description}
              />
            </CardContent>
          </Grid>
        )}

        {/* Action Buttons */}
        <Grid container sx={{ mt: 2 }}>
          <CardActions>
            <BottomRowButtons
              book={book}
              handleEdit={handleEdit}
              handleReturn={handleReturn}
              handleExtend={handleExtend}
              handleBorrow={handleBorrow}
              handleAddToQueue={handleAddToQueue}
              handleRemoveFromQueue={handleRemoveFromQueue}
            />
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BookModal;
