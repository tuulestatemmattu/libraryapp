import { SyntheticEvent, useState } from 'react';

import { Grid2 } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../hooks/useMainStore';
import { CreatedBook } from '../../interfaces/Book';
import { FetchedTag } from '../../interfaces/Tags';
import CopiesInput from './CopiesInput/CopiesInput';
import LocationSelect from './LocationSelect/LocationSelect';
import StyledInput from '../StyledInput/StyledInput';
import '../StyledInput/StyledInput';
import TagSelect from './TagSelect/TagSelect';

import '../../style.css';
import './AddBookForm.css';

interface AddBookFormProps {
  onSubmit: (book: CreatedBook) => Promise<{ status: number }>;
  initialValues: CreatedBook | null;
}

const AddBookForm = ({ onSubmit, initialValues }: AddBookFormProps) => {
  const defaultLocation = useMainStore((state) => state.location);
  const tags = useMainStore((state) => state.tags);

  const [title, setTitle] = useState(initialValues?.title || '');
  const [authors, setAuthors] = useState(initialValues?.authors || '');
  const [isbn, setIsbn] = useState(initialValues?.isbn || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [publishedDate, setPublishedDate] = useState(initialValues?.publishedDate || '');
  const [location, setLocation] = useState(initialValues?.location || defaultLocation);
  const [selectedTags, setSelectedTags] = useState<FetchedTag[]>([]);
  const [copies, setCopies] = useState(1);
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
      tags: selectedTags,
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
    setSelectedTags([]);
    setCopies(1);
  };

  const handleChangeLocation = (value: string) => {
    setLocation(value);
  };

  const handleTagSelection = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    if (typeof value !== 'string') {
      const tagsToSelect = tags.filter((tag) => value.includes(tag.name));

      setSelectedTags(tagsToSelect);
    }
  };

  return (
    <article>
      <form onSubmit={handleSubmit}>
        <Grid2 /*in MUI v7, this is just Grid and the old one is GridLegacy*/>
          <h2>Add a new book</h2>
          <StyledInput label="ISBN" value={isbn} setValue={setIsbn} />
          <StyledInput label="Title" value={title} setValue={setTitle} />
          <StyledInput label="Author" value={authors} setValue={setAuthors} />
          <StyledInput
            label="Description"
            value={description}
            setValue={setDescription}
            multiline={true}
          />
          <StyledInput label="Publication date" value={publishedDate} setValue={setPublishedDate} />
          <div className="tag-select-div">
            <TagSelect tags={tags} selectedTags={selectedTags} onSelectTag={handleTagSelection} />
          </div>
          <LocationSelect value={location} onChangeLocation={handleChangeLocation} />
          <CopiesInput copies={copies} setCopies={setCopies} />
          <ButtonGroup variant="contained" className="addbookform-buttons">
            <Button type="button" onClick={handleClear} variant="contained">
              Clear
            </Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </ButtonGroup>
        </Grid2>
      </form>
    </article>
  );
};

export default AddBookForm;
