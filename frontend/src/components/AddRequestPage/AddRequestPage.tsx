import { SyntheticEvent, useState } from 'react';

import { Box, Button, ButtonGroup, Grid, ListItem, ListItemButton } from '@mui/material';

import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import { searchBooks } from '../../services/isbn';
import { sendBookRequest } from '../../services/request';
import StyledTextField from '../StyledTextField/StyledTextField';

import '../../style.css';
import './AddRequestPage.css';

const AddRequestPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const { showNotification } = useNotification();

  interface Book {
    title: string;
    authors: string;
    isbn: string;
  }

  const [searchResults, setSearchResults] = useState<Book[]>([]);

  const handleSearch = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await searchBooks(title, author, isbn);
      if (result && result.length > 0) {
        console.log('Books found:', result);
        setSearchResults(result);
      } else {
        console.log('No books found.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error in searching books:', error);
      setSearchResults([]);
    }
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const request = {
      title,
      author,
      isbn,
    };
    try {
      if (!title && !author && !isbn) {
        showNotification('Please fill in at least one field!', 'error');
        return;
      }
      await sendBookRequest(request);
      showNotification('New request added successfully!', 'success');
      setTitle('');
      setAuthor('');
      setIsbn('');
    } catch {
      showNotification('Failed to add request. Please try again!', 'error');
    }
  };

  const handleClick = (title: string, author: string, isbn: string) => {
    setTitle(title);
    setAuthor(author);
    setIsbn(isbn);
  };

  const handleClear = () => {
    setTitle('');
    setAuthor('');
    setIsbn('');
  };

  return (
    <article>
      <h2>Search matching books or fill manually</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1} direction={'row'}>
          <StyledTextField label="Title" value={title} setValue={setTitle} />
          <StyledTextField label="Author" value={author} setValue={setAuthor} />
          <StyledTextField label="ISBN" value={isbn} setValue={setIsbn} />
        </Grid>
        <Box justifyContent="space-between" display="flex">
          <ButtonGroup variant="contained" className="addrequest-buttons">
            <Button type="button" onClick={handleClear} variant="contained">
              Clear
            </Button>
            <Button type="button" onClick={handleSearch} variant="contained">
              Search
            </Button>
          </ButtonGroup>
          <Button type="submit" variant="contained" className="addrequest-buttons">
            Send
          </Button>
        </Box>
      </form>
      <p></p>
      <h2>Search results</h2>
      {searchResults.length === 0 && <p>No results found</p>}
      {searchResults.length > 0 && <p>Click on a book to fill the form</p>}
      {searchResults.length > 0 && (
        <Box
          sx={{
            width: '90%',
            padding: '16px',
            bgcolor: 'background.paper',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          {searchResults.map((book, index) => (
            <ListItem key={index} component="div" disablePadding>
              <ListItemButton onClick={() => handleClick(book.title, book.authors, book.isbn)}>
                <strong>{book.title}</strong>
                {book.authors && `\xa0by ${book.authors}`}
                {book.isbn && ` (ISBN: ${book.isbn})`}
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      )}
    </article>
  );
};

export default AddRequestPage;
