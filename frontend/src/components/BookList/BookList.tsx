import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack } from '@mui/material';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { useTheme } from '@mui/material/styles';

import useMainStore from '../../hooks/useMainStore';
import { FetchedBook } from '../../interfaces/Book';
import { FetchedTag } from '../../interfaces/Tags';
import BookCard from '../BookCard/BookCard';
import FilterWithTags from '../FilterWithTags/FilterWithTags';

import '../../style.css';
import './BookList.css';

interface BookListProps {
  books: FetchedBook[];
}

const BookList = ({ books }: BookListProps) => {
  const [filter, setFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<FetchedTag[]>([]);
  const location = useMainStore((state) => state.location);
  const navigate = useNavigate();

  const theme = useTheme();
  const componentBackColor = theme.palette.componentBack.main;

  const filteredBooks = books.filter((book) => {
    const filteredByLocation = String(book.location).toLowerCase().includes(location.toLowerCase());
    const filteredByTags = selectedTags.every((selectedTag) =>
      book.tags.some((tag) => tag.id === selectedTag.id),
    );
    return (
      filteredByLocation &&
      filteredByTags &&
      (String(book.title).toLowerCase().includes(filter.toLowerCase()) ||
        String(book.authors).toLowerCase().includes(filter.toLowerCase()) ||
        String(book.publishedDate).toLowerCase().includes(filter.toLowerCase()))
    );
  });

  return (
    <article>
      <Stack style={{ width: '100%' }}>
        <Box justifyContent="space-between" display="flex" alignItems="center">
          <h2>Books in office</h2>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/addRequest')}
          >
            Request a new book
          </Button>
        </Box>
        <Box className="filter-box">
          <Input
            disableUnderline={true}
            placeholder="Search books in office"
            className="filter-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ backgroundColor: componentBackColor }}
          />
        </Box>
        <FilterWithTags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        <div className="books-container" style={{ backgroundColor: componentBackColor }}>
          <Grid container spacing={1} wrap="wrap" className="grid-container">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </Grid>
        </div>
      </Stack>
    </article>
  );
};

export default BookList;
