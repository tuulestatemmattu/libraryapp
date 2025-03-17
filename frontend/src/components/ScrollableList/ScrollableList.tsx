import AutoStories from '@mui/icons-material/AutoStories';
import { useTheme } from '@mui/material/styles';

import { FetchedBook } from '../../interfaces/Book';
import BookListItem from '../BookCard/BookCard';
import ItemsSlider from '../ItemsSlider/ItemsSlider';

import './YourBooks.css';

interface props {
  title: string;
  books: FetchedBook[];
}
const ScrollableList = ({ title, books }: props) => {
  const theme = useTheme();

  return (
    <div>
      {title}
      <article style={{ width: '95vw', backgroundColor: theme.palette.componentBack?.main }}>
        <ItemsSlider renderButtons={true}>
          {books.map((book: FetchedBook) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </ItemsSlider>
        {books.length === 0 && (
          <div
            className="book-card-placeholder"
            style={{ width: '100%', color: theme.palette.componentBack?.dark }}
          >
            <AutoStories className="icon" />
            <div className="text">You haven't borrowed any books</div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ScrollableList;
