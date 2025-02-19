import ItemsSlider from '../ItemsSlider/ItemsSlider';
import BookListItem from '../BookListItem/BookListItem';
import { FetchedBook } from '../../interfaces/Book';

interface props {
  title: string;
  books: FetchedBook[];
}
const ScrollableList = ({ title, books }: props) => {
  return (
    <div>
      {title}
      <ItemsSlider>
        {books.map((book: FetchedBook) => (
          <BookListItem key={book.id} book={book} />
        ))}
      </ItemsSlider>
    </div>
  );
};

export default ScrollableList;
