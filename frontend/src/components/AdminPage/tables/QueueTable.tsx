import { useEffect, useState } from 'react';

import { Box, Paper } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { QueueEntryData } from '../../../interfaces/QueueEntry';
import { getQueueEntries } from '../../../services/book';

const QueueTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getQueueEntries().then((result) =>
      setRows(
        result.map((q: QueueEntryData) => {
          return {
            id: q.id,
            title: q.book.title,
            user: q.user.email,
            createdAt: q.createdAt.slice(0, 10),
            position: q.position,
          };
        }),
      ),
    );
  }, []);

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Book Title', width: 400 },
    { field: 'user', headerName: 'User', width: 250 },
    {
        field: 'position',
        headerName: 'Position',
        width: 150,
    },
    {
      field: 'createdAt',
      headerName: 'Reserved',
      width: 150,
    },
  ];

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
  const paginationModel = { page: 0, pageSize: 20 };
  return (
    <article>
      <Box sx={{ textAlign: 'center' }}>
        <h1>Queue entry data</h1>
      </Box>
      <Paper sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel },
            sorting: {
              sortModel: [{ field: 'active', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          sx={{ border: 1 }}
          slots={{
            toolbar: CustomToolBar,
          }}
        />
      </Paper>
    </article>
  );
};

export default QueueTable;
