import './BookList.css';
import BookListItem from '../BookListItem/BookListItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../../constants';
import { Paper, TextField, MenuItem, Box, Grid2 } from '@mui/material';

interface Book {
  id: number;
  title: string;
  authors: string;
  isbn: string;
  description: string;
  publishedDate: string;
  location: string;
}

const filterOptions: (keyof Book | 'all')[] = ['all', 'title', 'authors', 'publishedDate'];
const officeLocations: string[] = [
  'Helsinki',
  'Tampere',
  'Copenhagen',
  'Aarhus',
  'Munich',
  'Berlin',
  'Oslo',
  'Łódź',
  'Malmö',
  'Stockholm',
  'Gothenburg',
  'Amsterdam',
  'Zurich',
  'London',
  'Southampton',
  'Philadelphia',
];

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState<keyof Book | 'all'>('all');
  const [location, setLocation] = useState<string>('Helsinki');

  useEffect(() => {
    axios.get(`${apiBaseUrl}/books`).then((res) => {
      setBooks(res.data);
    });
  }, []);

  const filteredBooks = books.filter((book) => {
    const filteredByLocation =
      location === 'All'
        ? true
        : String(book.location).toLowerCase().includes(location.toLowerCase());

    if (filterType === 'all') {
      return (
        filteredByLocation &&
        (String(book.title).toLowerCase().includes(filter.toLowerCase()) ||
          String(book.authors).toLowerCase().includes(filter.toLowerCase()) ||
          String(book.publishedDate).toLowerCase().includes(filter.toLowerCase()))
      );
    }

    return (
      filteredByLocation && String(book[filterType]).toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <>
      <Paper elevation={4} className="paper-container">
        <Box className="filter-box">
          <TextField
            select
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="filter-select"
          >
            <MenuItem value="All">All</MenuItem>
            {officeLocations.map((officeLocation) => (
              <MenuItem key={officeLocation} value={officeLocation}>
                {officeLocation}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Filter By"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as keyof Book | 'all')}
            className="filter-select"
          >
            {filterOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === 'all' ? 'All Fields' : option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
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
