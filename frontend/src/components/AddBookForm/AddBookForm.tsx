import { SyntheticEvent, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import { SelectChangeEvent } from '@mui/material/Select';

import { useNotification } from '../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../hooks/useMainStore';
import { CreatedBook } from '../../interfaces/Book';
import { FetchedTag } from '../../interfaces/Tags';
import StyledTextField from '../StyledTextField/StyledTextField';
import CopiesInput from './CopiesInput/CopiesInput';
import LocationSelect from './LocationSelect/LocationSelect';
import TagSelect from './TagSelect/TagSelect';

import '../../style.css';
import './AddBookForm.css';

interface AddBookFormProps {
  onSubmit: (book: CreatedBook) => Promise<{ status: number }>;
  onIsbnSearch: (isbn: string) => Promise<void>;
  initialValues: CreatedBook | null;
}

const AddBookForm = ({ onSubmit, onIsbnSearch, initialValues }: AddBookFormProps) => {
  const defaultLocation = useMainStore((state) => state.location);
  const tags = useMainStore((state) => state.tags);

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [authors, setAuthors] = useState(initialValues?.authors ?? '');
  const [isbn, setIsbn] = useState(initialValues?.isbn ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [publishedDate, setPublishedDate] = useState(initialValues?.publishedDate ?? '');
  const [location, setLocation] = useState(initialValues?.location ?? defaultLocation);
  const [selectedTags, setSelectedTags] = useState<FetchedTag[]>([]);
  const [copies, setCopies] = useState(1);
  const [imageLinks, setImageLinks] = useState(initialValues?.imageLinks);
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
      imageLinks,
    };

    try {
      const response = await onSubmit(book);

      if (response.status === 201 || response.status === 200) {
        showNotification('New book added successfully!', 'success');
        setTitle('');
        setAuthors('');
        setIsbn('');
        setDescription('');
        setPublishedDate('');
        setCopies(1);
        setImageLinks(undefined);
      } else {
        showNotification('Failed to add the book. Please try again!', 'error');
      }
    } catch (error) {
      console.error('error while adding a book', error);
      showNotification('Error occurred while adding a book', 'error');
    }
  };

  const handleIsbnSearch = async () => {
    await onIsbnSearch(isbn);
  };

  const handleClear = () => {
    setTitle('');
    setAuthors('');
    setIsbn('');
    setDescription('');
    setPublishedDate('');
    setSelectedTags([]);
    setCopies(1);
    setImageLinks(undefined);
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
        <Grid
          container
          spacing={1}
          direction="row" /*in MUI v7, this is just Grid and the old one is GridLegacy*/
        >
          <Grid container spacing={1} direction="row">
            <Box display="flex" flexDirection="row" alignItems="center" gap={2} width="100%">
              <Grid sx={{ flexGrow: 1 }}>
                <StyledTextField label="ISBN" value={isbn} setValue={setIsbn} />
              </Grid>
              <Grid>
                <Button onClick={handleIsbnSearch}>Search</Button>
              </Grid>
            </Box>
            <StyledTextField label="Title" value={title} setValue={setTitle} />
            <StyledTextField label="Author" value={authors} setValue={setAuthors} />
            <StyledTextField
              label="Publication date"
              value={publishedDate}
              setValue={setPublishedDate}
            />
            <StyledTextField
              label="Description"
              value={description}
              setValue={setDescription}
              multiline={true}
            />
            <div className="tag-select-div">
              <TagSelect tags={tags} selectedTags={selectedTags} onSelectTag={handleTagSelection} />
            </div>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2} width="100%">
              <Grid sx={{ flexShrink: 0, width: 130 }}>
                <CopiesInput copies={copies} setCopies={setCopies} />
              </Grid>
              <Grid sx={{ flexGrow: 1 }}>
                <LocationSelect value={location} onChangeLocation={handleChangeLocation} />
              </Grid>
            </Box>
            <ButtonGroup variant="contained" className="addbookform-buttons">
              <Button type="button" onClick={handleClear} variant="contained">
                Clear
              </Button>
              <Button type="submit" variant="contained">
                Add
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
    </article>
  );
};

export default AddBookForm;
