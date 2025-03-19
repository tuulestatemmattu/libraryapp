import { Stack } from '@mui/material';

import useMainStore from '../hooks/useMainStore';
import { FetchedBook } from '../interfaces/Book';
import BookList from './BookList/BookList';
import ScrollableList from './ScrollableList/ScrollableList';

import '../style.css';

const HomePage = () => {
  const books = useMainStore((state) => state.books);

  return (
    <article>
      <h2>
        <Stack>
          <ScrollableList
            title="Your books"
            books={books
              /* Filter my books then sort first books that are reserved and ready, then books that you have loaned then books, then other reserved books */
              .filter((book: FetchedBook) => book.borrowedByMe || book.queuedByMe)
              .sort((b1: FetchedBook, b2: FetchedBook) =>
                b1.queueSize == 0 && b2.queueSize != 0
                  ? -1
                  : (b1.borrowedByMe === b2.borrowedByMe ? 0 : b1.borrowedByMe ? -1 : 1) ||
                    new Date(b1.lastBorrowedDate).getTime() -
                      new Date(b2.lastBorrowedDate).getTime(),
              )}
          />
        </Stack>
      </h2>
      <BookList
        /* Sort books 'Available, not available, borrow by me' all categorys alphabetically */
        books={books.sort(
          (b1, b2) =>
            (b1.copiesAvailable > 0 === b2.copiesAvailable > 0
              ? 0
              : b1.copiesAvailable > 0
                ? -1
                : 1) ||
            (b1.borrowedByMe === b2.borrowedByMe ? 0 : b1.borrowedByMe ? 1 : -1) ||
            (b1.title === b2.title ? 0 : b1.title < b2.title ? -1 : 1),
        )}
      />
    </article>
  );
};

export default HomePage;
