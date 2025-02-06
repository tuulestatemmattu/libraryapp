import BookListItem from './BookListItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Paper, TextField, MenuItem, Box, Grid2 } from '@mui/material';

interface Book {
  id: number;
  title: string;
  authors: string;
  isbn: string;
  description: string;
  publishedDate: string;
}

const filterOptions: (keyof Book | 'all')[] = ['all', 'title', 'authors', 'publishedDate'];

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState<keyof Book | 'all'>('all');

  useEffect(() => {
    axios.get(`${apiBaseUrl}/books`).then((res) => {
      setBooks(res.data);
    });
  }, []);

  const filteredBooks = books.filter((book) => {
    if (filterType === 'all') {
      return (
        String(book.title).toLowerCase().includes(filter.toLowerCase()) ||
        String(book.authors).toLowerCase().includes(filter.toLowerCase()) ||
        String(book.publishedDate).toLowerCase().includes(filter.toLowerCase())
      );
    }

    return String(book[filterType]).toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <><Paper 
        elevation={4}
        sx={{ 
          padding: 2,
          marginBottom: 2
        }}
      >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          select
          label="Filter By"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as keyof Book | 'all')}
          sx={{ minWidth: { xs: 100, sm: 170, md: 170 } }}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option === 'all' ? 'All Fields' : option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          placeholder='Search'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Box>
    </Paper>
      <Grid2
        container
        spacing={2}
        wrap='wrap'
        sx={{ 
          justifyContent: "flex-start",
          alignItems: "flex-start",
          margin: "1vw",
        }}
      >
          {filteredBooks.map((book) => (
            <Grid2>
            <BookListItem key={book.id} book={book} />
            </Grid2>
          ))}
      </Grid2>
    </>
  );
};

export default BookList;
