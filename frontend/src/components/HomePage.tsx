import BookList from './BookList/BookList';
import { FetchedBook } from '../interfaces/Book';
import ScrollableList from './ScrollableList/ScrollableList';

interface HomePageProps {
  books: FetchedBook[];
}

const HomePage = ({ books }: HomePageProps) => {
  return (
    <div>
      <ScrollableList
        title="Your books"
        books={books
          .filter((book) => book.borrowedByMe)
          .sort((b1, b2) =>
            b1.lastBorrowedDate === b2.lastBorrowedDate
              ? 0
              : b1.lastBorrowedDate < b2.lastBorrowedDate
                ? -1
                : 1,
          )}
      />
      <BookList
        books={books.sort(
          (b1, b2) =>
            (b1.available === b2.available ? 0 : b1.available ? -1 : 1) ||
            (b1.borrowedByMe === b2.borrowedByMe ? 0 : b1.borrowedByMe ? 1 : -1) ||
            (b1.title === b2.title ? 0 : b1.title < b2.title ? -1 : 1),
        )}
      />
    </div>
  );
};

export default HomePage;
