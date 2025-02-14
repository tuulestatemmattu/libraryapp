import './BookList.css';
import BookListItem from '../BookListItem/BookListItem';
import { useState } from 'react';
import { Paper, TextField, Box, Grid2 } from '@mui/material';
import { FetchedBook } from '../../interfaces/Book';

interface props {
  books: FetchedBook[];
}

const BookList = ({ books }: props) => {
  const [filter, setFilter] = useState('');

  const location: string = 'Helsinki';

  const filteredBooks = books.filter((book) => {
    const filteredByLocation =
      location === 'All'
        ? true
        : String(book.location).toLowerCase().includes(location.toLowerCase());
    return (
      filteredByLocation &&
      (String(book.title).toLowerCase().includes(filter.toLowerCase()) ||
        String(book.authors).toLowerCase().includes(filter.toLowerCase()) ||
        String(book.publishedDate).toLowerCase().includes(filter.toLowerCase()))
    );
  });

  return (
    <>
      <Paper elevation={4} className="paper-container">
        <Box className="filter-box">
          <TextField
            fullWidth
            placeholder="Search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Box>
      </Paper>
      <Grid2 container spacing={2} wrap="wrap" className="grid-container">
        {filteredBooks.map((book) => (
          <BookListItem key={book.id} book={book} />
        ))}
      </Grid2>
    </>
  );
};

export default BookList;
