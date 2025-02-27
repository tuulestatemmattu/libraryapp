import BookList from './BookList/BookList';
import ScrollableList from './ScrollableList/ScrollableList';
import '../style.css';
import useMainStore from '../hooks/useMainStore';

const HomePage = () => {
  const books = useMainStore((state) => state.books);

  return (
    <article>
      <h2>
        <ScrollableList
          title="Your books"
          books={books
            /* Filter my books then sort first books that youve had the longest */
            .filter((book) => book.borrowedByMe)
            .sort((b1, b2) =>
              b1.lastBorrowedDate === b2.lastBorrowedDate
                ? 0
                : b1.lastBorrowedDate < b2.lastBorrowedDate
                  ? -1
                  : 1,
            )}
        />
      </h2>

      <BookList
        /* Sort books 'Available, not available, borrow by me' all categorys alphabetically */
        books={books.sort(
          (b1, b2) =>
            (b1.copiesAvailable > 0 === b2.copiesAvailable > 0 ? 0 : b1.copiesAvailable > 0 ? -1 : 1) ||
            (b1.borrowedByMe === b2.borrowedByMe ? 0 : b1.borrowedByMe ? 1 : -1) ||
            (b1.title === b2.title ? 0 : b1.title < b2.title ? -1 : 1),
        )}
      />
    </article>
  );
};

export default HomePage;
