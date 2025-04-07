import { SyntheticEvent, useState } from 'react';

import { Button, ButtonGroup, Grid } from '@mui/material';

import StyledTextField from '../StyledTextField/StyledTextField';

import '../../style.css';
import './AddRequestPage.css';

import { searchBooks } from '../../services/isbn';

const AddRequestPage = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchIsbn, setSearchIsbn] = useState('');
  
  interface Book {
    title: string;
    authors: string;
    isbn: string;
  }

  const [searchResults, setSearchResults] = useState<Book[]>([]);

  const handleSearch = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await searchBooks(searchTitle, searchAuthor, searchIsbn);
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
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const request = {
      searchTitle,
      searchAuthor,
      searchIsbn,
    };
    try {
      console.log('Request to add book:', request);
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };


  const handleSearchClear = () => {
    setSearchTitle('');
    setSearchAuthor('');
    setSearchIsbn('');
  };

  const handleClick = (title: string, author: string, isbn: string) => {
    setSearchTitle(title);
    setSearchAuthor(author);
    setSearchIsbn(isbn);
  };

  return (
    <article>
      <h2>Search matching books</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1} direction={'row'}>
          <StyledTextField label="Search by title" value={searchTitle} setValue={setSearchTitle} />
          <StyledTextField label="Search by author" value={searchAuthor} setValue={setSearchAuthor} />
          <StyledTextField label="Search by ISBN" value={searchIsbn} setValue={setSearchIsbn} />
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
              <strong>{book.title}</strong> { book.authors && `by ${book.authors}` } { book.isbn && `(ISBN: ${book.isbn})`}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default AddRequestPage;
