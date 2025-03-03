import React, { useState, SyntheticEvent } from 'react';
import { CreatedBook } from '../../interfaces/Book';
import StyledInput from '../StyledInput/StyledInput';
import LocationSelect from '../LocationSelect/LocationSelect';
import { TextField, Button, ButtonGroup } from '@mui/material';
import '../StyledInput/StyledInput';
import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../hooks/useMainStore';

import '../../style.css';
import './AddBookForm.css';

interface BookFormProps {
  onSubmit: (book: CreatedBook) => Promise<{ status: number }>;
  initialValues: CreatedBook | null;
}

const AddBookForm: React.FC<BookFormProps> = ({ onSubmit, initialValues }) => {
  const defaultLocation = useMainStore((state) => state.location);

  const [title, setTitle] = useState(initialValues?.title || '');
  const [authors, setAuthors] = useState(initialValues?.authors || '');
  const [isbn, setIsbn] = useState(initialValues?.isbn || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [publishedDate, setPublishedDate] = useState(initialValues?.publishedDate || '');
  const [location, setLocation] = useState(initialValues?.location || defaultLocation);
  const [copies, setCopies] = useState(initialValues?.copies || 1);
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
      copies,
    };

    if (initialValues?.imageLinks) {
      book.imageLinks = initialValues.imageLinks;
    }
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
        setCopies(1);
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
    setCopies(1);
  };

  const handleChangeLocation = (value: string) => {
    setLocation(value);
  };

  return (
    <article>
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
        <div>
          <TextField
            className="styled-input"
            label="Copies"
            type="number"
            variant="standard"
            value={copies}
            name="copies"
            onChange={({ target }) => setCopies(Number(target.value))}
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </div>
        <div className="addbookform-bottom-row">
          <LocationSelect value={location} onChangeLocation={handleChangeLocation} />
          <ButtonGroup variant="contained" className="addbookform-buttons">
            <Button type="button" onClick={handleClear} variant="contained">
              Clear
            </Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </ButtonGroup>
        </div>
      </form>
    </article>
  );
};

export default AddBookForm;
