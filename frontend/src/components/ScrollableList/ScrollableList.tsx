import ItemsSlider from '../ItemsSlider/ItemsSlider';
import BookListItem from '../BookListItem/BookListItem';
import { FetchedBook } from '../../interfaces/Book';

interface props {
  books: FetchedBook[];
}
const ScrollableList = ({ books }: props) => {
  return (
    <ItemsSlider title="stuff">
      {books.map((book: FetchedBook) => (
        <BookListItem key={book.id} book={book} />
      ))}
    </ItemsSlider>
  );
};

export default ScrollableList;
