import React, { useState, SyntheticEvent } from 'react';
import { CreatedBook } from '../interfaces/Book';
import StyledInput from './StyledInput/StyledInput';
import { TextField, Button } from '@mui/material';
import './StyledInput/StyledInput.css';

interface BookFormProps {
  onSubmit: (book: CreatedBook) => void;
  initialValues: CreatedBook | null;
}

const AddBookForm: React.FC<BookFormProps> = ({ onSubmit, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [authors, setAuthors] = useState(initialValues?.authors || '');
  const [isbn, setIsbn] = useState(initialValues?.isbn || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [publishedDate, setPublishedDate] = useState(initialValues?.publishedDate || '');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const book: CreatedBook = {
      title,
      authors,
      isbn,
      description,
      publishedDate,
    };
    onSubmit(book);
    setTitle('');
    setAuthors('');
    setIsbn('');
    setDescription('');
    setPublishedDate('');
  };

  const handleClear = () => {
    setTitle('');
    setAuthors('');
    setIsbn('');
    setDescription('');
    setPublishedDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <StyledInput lable="title" value={title} setValue={setTitle} />
      </div>
      <div>
        <StyledInput lable="Author" value={authors} setValue={setAuthors} />
      </div>
      <div>
        <StyledInput lable="ISBN" value={isbn} setValue={setIsbn} />
      </div>
      <div>
        <TextField
          className="styled-input"
          label="Description"
          multiline
          type="text"
          variant="standard"
          value={description}
          name="description"
          onChange={({ target }) => setDescription(target.value)}
        />
      </div>
      <div>
        <StyledInput lable="publishYear" value={publishedDate} setValue={setPublishedDate} />
      </div>
      <Button type="submit">Add</Button>
      <Button type="button" onClick={handleClear}>
        Clear
      </Button>
    </form>
  );
};

export default AddBookForm;
