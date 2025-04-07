import { SyntheticEvent, useState } from 'react';

import { Button, ButtonGroup, Grid } from '@mui/material';

import StyledTextField from '../StyledTextField/StyledTextField';

import '../../style.css';
import './AddRequestPage.css';

const AddRequestPage = () => {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [isbn, setIsbn] = useState('');

  const handleSearch = (e: SyntheticEvent) => {
    e.preventDefault();
    const request = {
      title,
      authors,
      isbn,
    };
    try {
      console.log('Searching...', request);
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const request = {
      title,
      authors,
      isbn,
    };
    try {
      console.log('Request to add book:', request);
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  const handleClear = () => {
    setTitle('');
    setAuthors('');
    setIsbn('');
  };

  return (
    <article>
      <h2>Search matching books</h2>
      <form onSubmit={handleSearch}>
        <Grid container spacing={1} direction={'row'}>
          <StyledTextField label="ISBN" value={isbn} setValue={setIsbn} />
          <StyledTextField label="Title" value={title} setValue={setTitle} />
          <StyledTextField label="Author" value={authors} setValue={setAuthors} />
        </Grid>
        <ButtonGroup variant="contained" className="addrequest-buttons">
          <Button type="button" onClick={handleClear} variant="contained">
            Clear
          </Button>
          <Button type="submit" variant="contained">
            Search
          </Button>
        </ButtonGroup>
      </form>
      <h2>Add a request</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1} direction={'row'}>
          <StyledTextField label="ISBN" value={isbn} setValue={setIsbn} />
          <StyledTextField label="Title" value={title} setValue={setTitle} />
          <StyledTextField label="Author" value={authors} setValue={setAuthors} />
          <ButtonGroup variant="contained" className="addrequest-buttons">
            <Button type="button" onClick={handleClear} variant="contained">
              Clear
            </Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </ButtonGroup>
        </Grid>
      </form>
    </article>
  );
};

export default AddRequestPage;
