import BookList from './BookList/BookList';
import { getBooks } from '../services/book';
import { useEffect, useState } from 'react';
import { FetchedBook } from '../interfaces/Book';

const HomePage = () => {
  const [books, setBooks] = useState<FetchedBook[]>([]);

  useEffect(() => {
    getBooks().then((result) => setBooks(result));
  }, []);

  return (
    <div>
      <BookList books={books} />
    </div>
  );
};

export default HomePage;
