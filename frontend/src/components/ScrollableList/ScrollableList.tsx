import AutoStories from '@mui/icons-material/AutoStories';

import { FetchedBook } from '../../interfaces/Book';
import BookListItem from '../BookCard/BookCard';
import ItemsSlider from '../ItemsSlider/ItemsSlider';

import './YourBooks.css';

interface props {
  title: string;
  books: FetchedBook[];
}
const ScrollableList = ({ title, books }: props) => {
  return (
    <div>
      {title}
      <article style={{ width: '95vw' }}>
        <ItemsSlider renderButtons={true}>
          {books.map((book: FetchedBook) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </ItemsSlider>
        {books.length === 0 && (
          <div className="book-card-placeholder">
            <AutoStories className="icon" />
            <div className="text">You haven't borrowed any books</div>
          </div>
        )}
      </article>
    </div>
  );
};
export default ScrollableList;
