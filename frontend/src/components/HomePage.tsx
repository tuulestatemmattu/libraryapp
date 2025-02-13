import BookList from './BookList/BookList';
import { getBooks } from '../services/book';
import { useEffect, useState } from 'react';
import { FetchedBook } from '../interfaces/Book';
import ScrollableList from './ScrollableList/ScrollableList';

const HomePage = () => {
  const [books, setBooks] = useState<FetchedBook[]>([]);

  useEffect(() => {
    getBooks().then((result) => setBooks(result));
  }, []);

  return (
    <div>
      <ScrollableList books={books} />
      <BookList books={books} />
    </div>
  );
};

export default HomePage;
