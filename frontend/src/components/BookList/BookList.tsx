import './BookList.css';
import BookListItem from '../BookCard/BookCard';
import { useState } from 'react';
import { Input, Box, Grid2 } from '@mui/material';
import { FetchedBook } from '../../interfaces/Book';
import useMainStore from '../../hooks/useMainStore';

interface props {
  books: FetchedBook[];
}

const BookList = ({ books }: props) => {
  const [filter, setFilter] = useState('');
  const location = useMainStore((state) => state.location);

  const filteredBooks = books.filter((book) => {
    const filteredByLocation = String(book.location).toLowerCase().includes(location.toLowerCase());
    return (
      filteredByLocation &&
      (String(book.title).toLowerCase().includes(filter.toLowerCase()) ||
        String(book.authors).toLowerCase().includes(filter.toLowerCase()) ||
        String(book.publishedDate).toLowerCase().includes(filter.toLowerCase()))
    );
  });

  return (
    <>
      <h2>Books in office</h2>
      <Box className="filter-box">
        <Input
          disableUnderline={true}
          placeholder="Search books in office"
          className="filter-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Box>
      <div className="books-container">
        <Grid2 container spacing={1} wrap="wrap" className="grid-container">
          {filteredBooks.map((book) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </Grid2>
      </div>
    </>
  );
};

export default BookList;
