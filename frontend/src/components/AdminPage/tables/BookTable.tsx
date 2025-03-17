import React, { useEffect, useState } from 'react';

import { Box, Button, Paper, SelectChangeEvent, Stack, TextField, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import useMainStore from '../../../hooks/useMainStore';
import { FetchedBook } from '../../../interfaces/Book';
import { FetchedTag } from '../../../interfaces/Tags';
import { addBook, getBooks } from '../../../services/book';
import LocationSelect from '../../LocationSelect/LocationSelect';
import TagSelect from '../../TagSelect/TagSelect';

const BookTable = () => {
  const [rows, setRows] = useState<FetchedBook[]>([]);
  const tags = useMainStore((state) => state.tags);
  const addOrUpdateBook = useMainStore((state) => state.addOrUpdateBook);
  const [selectedTags, setSelectedTags] = useState<FetchedTag[]>([]);
  const [newBook, setNewBook] = useState({
    title: '',
    authors: '',
    isbn: '',
    publishedDate: '',
    description: '',
    location: 'Helsinki',
    copies: 1,
    tags: selectedTags,
  });

  useEffect(() => {
    getBooks().then((result) =>
      setRows(
        result.map((b: FetchedBook) => {
          return {
            id: b.id,
            title: b.title,
            authors: b.authors,
            isbn: b.isbn,
            publishedDate: b.publishedDate,
            description: b.description,
            location: b.location,
            copies: b.copies,
          };
        }),
      ),
    );
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleLocationChange = (location: string) => {
    setNewBook({ ...newBook, location });
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

  const handleAddBook = () => {
    console.log(newBook);
    addBook(newBook).then((result) => {
      setRows([...rows, result]);
      addOrUpdateBook(result);
      setNewBook({
        title: '',
        authors: '',
        isbn: '',
        publishedDate: '',
        description: '',
        location: 'Helsinki',
        copies: 0,
        tags: selectedTags,
      });
    });
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'authors', headerName: 'Authors', width: 200 },
    { field: 'isbn', headerName: 'ISBN', width: 180 },
    { field: 'publishedDate', headerName: 'Published Date', width: 150 },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
              width: '100%',
            }}
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'copies', headerName: 'Copies', width: 150 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const CustomToolBar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector slotProps={{ tooltip: { title: 'Change density' } }} />
        <Box sx={{ flexGrow: 1 }} />
      </GridToolbarContainer>
    );
  };

  return (
    <div>
      <Box sx={{ textAlign: 'center' }}>
        <h1>Books</h1>
      </Box>
      <Paper sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={[...rows, ...(newBook.title ? [{ ...newBook, id: '-' }] : [])]}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 1 }}
          slots={{
            toolbar: CustomToolBar,
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mr: 1, ml: 1 }}>
          <Stack direction="row" spacing={1} alignItems={'center'} mb={1}>
            <TextField
              label="Title"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
            />
            <TextField
              label="Authors"
              name="authors"
              value={newBook.authors}
              onChange={handleInputChange}
            />
            <TextField label="ISBN" name="isbn" value={newBook.isbn} onChange={handleInputChange} />
            <TextField
              label="Published Date"
              name="publishedDate"
              value={newBook.publishedDate}
              onChange={handleInputChange}
            />
            <TextField
              label="Description"
              name="description"
              value={newBook.description}
              onChange={handleInputChange}
            />

            <LocationSelect value={newBook.location} onChangeLocation={handleLocationChange} />
            <TextField
              label="Copies"
              name="copies"
              value={newBook.copies}
              onChange={handleInputChange}
            />
            <Box sx={{ width: 200 }}>
              <TagSelect tags={tags} selectedTags={selectedTags} onSelectTag={handleTagSelection} />
            </Box>

            <Button variant="contained" onClick={handleAddBook}>
              Add Book
            </Button>
          </Stack>
        </Box>
      </Paper>
    </div>
  );
};

export default BookTable;
