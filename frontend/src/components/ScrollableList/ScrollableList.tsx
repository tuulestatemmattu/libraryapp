import ItemsSlider from '../ItemsSlider/ItemsSlider';
import BookListItem from '../BookCard/BookCard';
import { FetchedBook } from '../../interfaces/Book';
import { Card, CardContent } from '@mui/material';
import './YourBooks.css';

interface props {
  title: string;
  books: FetchedBook[];
}
const ScrollableList = ({ title, books }: props) => {
  return (
    <div>
      {title}
      <ItemsSlider>
        {books.length
          ? books.map((book: FetchedBook) => <BookListItem key={book.id} book={book} />)
          : [...Array(1).keys()].map((i) => (
              <Card className="book-card book-card-placeholdre" key={i}>
                <CardContent>You haven't borrowed any books.</CardContent>
              </Card>
            ))}
      </ItemsSlider>
    </div>
  );
};

export default ScrollableList;
