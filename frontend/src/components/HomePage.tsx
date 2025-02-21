import BookList from './BookList/BookList';
import { FetchedBook } from '../interfaces/Book';

interface HomePageProps {
  books: FetchedBook[];
}

const HomePage = ({ books }: HomePageProps) => {
  return (
    <div>
      <BookList books={books} />
    </div>
  );
};

export default HomePage;
