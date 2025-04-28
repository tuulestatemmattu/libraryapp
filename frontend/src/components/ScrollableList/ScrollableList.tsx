import AutoStories from '@mui/icons-material/AutoStories';
import { useTheme } from '@mui/material/styles';

import { FetchedBook } from '../../interfaces/Book';
import BookCard from '../BookCard/BookCard';
import ItemsSlider from '../ItemsSlider/ItemsSlider';

import './YourBooks.css';

interface ScrollableListProps {
  title: string;
  books: FetchedBook[];
}
const ScrollableList = ({ title, books }: ScrollableListProps) => {
  const theme = useTheme();

  return (
    <div data-testid={title}>
      {title}
      <article
        style={{
          width: '95vw',
          borderRadius: '8px',
          backgroundColor: theme.palette.componentBack.main,
        }}
      >
        <ItemsSlider renderButtons={true}>
          {books.map((book: FetchedBook) => (
            <BookCard key={book.id} book={book} />
          ))}
        </ItemsSlider>
        {books.length === 0 && (
          <div
            className="book-card-placeholder"
            style={{ width: '100%', color: theme.palette.componentBack.dark }}
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
