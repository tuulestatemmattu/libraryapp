import { SyntheticEvent, useState } from 'react';

import { Button, ButtonGroup, Grid } from '@mui/material';

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
      }
    } catch (error) {
      console.error('Error in searching books:', error);
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
      await sendBookRequest(request);
      showNotification('New request added successfully!', 'success');
      setTitle('');
      setAuthor('');
      setIsbn('');
    } catch {
      showNotification('Failed to add request. Please try again!', 'error');
    }
  };

  const handleSearchClear = () => {
    setTitle('');
    setAuthor('');
    setIsbn('');
  };

  const handleClick = (title: string, author: string, isbn: string) => {
    setTitle(title);
    setAuthor(author);
    setIsbn(isbn);
  };

  return (
    <article>
      <h2>Search matching books</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1} direction={'row'}>
          <StyledTextField label="Search by title" value={title} setValue={setTitle} />
          <StyledTextField label="Search by author" value={author} setValue={setAuthor} />
          <StyledTextField label="Search by ISBN" value={isbn} setValue={setIsbn} />
        </Grid>
        <ButtonGroup variant="contained" className="addrequest-buttons">
          <Button type="button" onClick={handleSearchClear} variant="contained">
            Clear
          </Button>
          <Button type="button" onClick={handleSearch} variant="contained">
            Search
          </Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </ButtonGroup>
      </form>
      <h2>Search results</h2>
      <ul>
        {searchResults.map((book, index) => (
          <li key={index}>
            <a onClick={() => handleClick(book.title, book.authors, book.isbn)}>
              <strong>{book.title}</strong> {book.authors && `by ${book.authors}`}{' '}
              {book.isbn && `(ISBN: ${book.isbn})`}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default AddRequestPage;
