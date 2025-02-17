import React, { useState, SyntheticEvent } from 'react';
import { CreatedBook } from '../interfaces/Book';
import StyledInput from './StyledInput/StyledInput';
import LocationSelect from './LocationSelect/LocationSelect';
import { TextField, Button } from '@mui/material';
import './StyledInput/StyledInput.css';
import { useNotification } from '../context/NotificationsProvider/NotificationProvider';

interface BookFormProps {
  onSubmit: (book: CreatedBook) => Promise<{ status: number }>;
  initialValues: CreatedBook | null;
}

const AddBookForm: React.FC<BookFormProps> = ({ onSubmit, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [authors, setAuthors] = useState(initialValues?.authors || '');
  const [isbn, setIsbn] = useState(initialValues?.isbn || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [publishedDate, setPublishedDate] = useState(initialValues?.publishedDate || '');
  const [location, setLocation] = useState(initialValues?.location || 'Helsinki');
  const { showNotification } = useNotification();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const book: CreatedBook = {
      title,
      authors,
      isbn,
      description,
      publishedDate,
      location,
    };

    try {
      const response = await onSubmit(book);

      if (response?.status === 201 || response?.status === 200) {
        showNotification('New book added successfully!', 'success');
        setTitle('');
        setAuthors('');
        setIsbn('');
        setDescription('');
        setPublishedDate('');
        setLocation('');
      } else {
        showNotification('Failed to add the book. Please try again!', 'error');
      }
    } catch (error) {
      console.error('error while adding a book', error);
      showNotification('Error occurred while adding a book', 'error');
    }
  };

  const handleClear = () => {
    setTitle('');
    setAuthors('');
    setIsbn('');
    setDescription('');
    setPublishedDate('');
    setLocation('');
  };

  const handleChangeLocation = (value: string) => {
    setLocation(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <StyledInput label="title" value={title} setValue={setTitle} />
      </div>
      <div>
        <StyledInput label="Author" value={authors} setValue={setAuthors} />
      </div>
      <div>
        <StyledInput label="ISBN" value={isbn} setValue={setIsbn} />
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
        <StyledInput label="publishYear" value={publishedDate} setValue={setPublishedDate} />
      </div>
      <div className="location-select-div">
        <LocationSelect value={location} onChangeLocation={handleChangeLocation} />
      </div>
      <Button type="submit">Add</Button>
      <Button type="button" onClick={handleClear}>
        Clear
      </Button>
    </form>
  );
};

export default AddBookForm;
