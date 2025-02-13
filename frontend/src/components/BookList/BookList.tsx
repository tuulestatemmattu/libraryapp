import './BookList.css';
import BookListItem from '../BookListItem/BookListItem';
import { useState } from 'react';
import { Paper, TextField, MenuItem, Box, Grid2 } from '@mui/material';
import { FetchedBook } from '../../interfaces/Book';

const filterOptions: (keyof FetchedBook | 'all')[] = ['all', 'title', 'authors', 'publishedDate'];
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

interface props {
  books: FetchedBook[];
}

const BookList = ({ books }: props) => {
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState<keyof FetchedBook | 'all'>('all');
  const [location, setLocation] = useState<string>('Helsinki');

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
            slotProps={{
              input: { id: "filter-location" },
              inputLabel: { htmlFor: "filter-location" },
              }}
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
            onChange={(e) => setFilterType(e.target.value as keyof FetchedBook | 'all')}
            className="filter-select"
            slotProps={{
              input: { id: "filter-by" },
              inputLabel: { htmlFor: "filter-by" },
              }}
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
