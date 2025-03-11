import { useEffect, useState } from 'react';

import { Box, Paper, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { FetchedBook } from '../../../interfaces/Book';
import { getBooks } from '../../../services/book';

const BookTable = () => {
  const [rows, setRows] = useState([]);

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
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 1 }}
          slots={{
            toolbar: CustomToolBar,
          }}
        />
      </Paper>
    </div>
  );
};

export default BookTable;
