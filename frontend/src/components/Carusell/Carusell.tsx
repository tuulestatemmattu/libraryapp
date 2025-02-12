import BookListItem from '../BookListItem/BookListItem';
import { Grid2 } from '@mui/material';

import { FetchedBook } from '../../interfaces/Book';

interface Props {
  books: FetchedBook[];
}

const Carusell = ({ books }: Props) => {
  return (
    <>
      <Grid2 container spacing={2} wrap="wrap" className="grid-container">
        {books.map((book) => (
          <BookListItem key={book.id} book={book} />
        ))}
      </Grid2>
    </>
  );
};

export default Carusell;
