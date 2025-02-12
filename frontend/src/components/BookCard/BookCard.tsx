import { CardMedia } from '@mui/material';
import './BookCard.css';

interface BookListItemProps {
  book: {
    id: number;
    title: string;
    authors: string;
    isbn: string;
    description: string;
    publishedDate: string;
  };
}

const BookCard = ({ book }: BookListItemProps) => {
  return (
    <div className="bookcard">
      <div className="book-info-box">
        <h1 className="book-card-header">Book Details</h1>
        <div className="book-info">
          <div className="book-image">
            <CardMedia
              component="img"
              src="https://m.media-amazon.com/images/I/91VvijsCGIL._AC_UF894,1000_QL80_.jpg"
              alt="book cover"
            />
          </div>
          <h2 className="book-card-name">{book.title}</h2>
          <p className="book-card-meta">
            <span>Author:</span> {book.authors}
          </p>
          <p className="book-card-meta">
            <span>Published:</span> {book.publishedDate}
          </p>
          <h3 className="book-card-desc">{book.description}</h3>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
