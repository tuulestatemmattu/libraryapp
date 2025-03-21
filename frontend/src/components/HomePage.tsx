import { Stack } from '@mui/material';

import useMainStore from '../hooks/useMainStore';
import { BookStatus, FetchedBook } from '../interfaces/Book';
import BookList from './BookList/BookList';
import ScrollableList from './ScrollableList/ScrollableList';

import '../style.css';

const HomePage = () => {
  const books = useMainStore((state) => state.books);

  const sortByOrder = (statusOrder: BookStatus[]) => {
    return (b1: FetchedBook, b2: FetchedBook) => {
      if (b1.status === b2.status) {
        return b1.title.localeCompare(b2.title);
      }
      return statusOrder.indexOf(b1.status) - statusOrder.indexOf(b2.status);
    };
  };

  const yourBooks = books
    .filter((book: FetchedBook) => book.borrowedByMe || book.queuedByMe)
    .sort(sortByOrder(['ready', 'late', 'borrowed', 'reserved']));

  const allBooks = books.sort(
    sortByOrder(['available', 'unavailable', 'reserved', 'borrowed', 'late', 'ready']),
  );

  return (
    <article>
      <h2>
        <Stack>
          <ScrollableList title="Your books" books={yourBooks} />
        </Stack>
      </h2>
      <BookList books={allBooks} />
    </article>
  );
};

export default HomePage;
