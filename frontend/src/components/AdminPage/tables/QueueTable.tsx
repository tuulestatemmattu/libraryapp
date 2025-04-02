import { useEffect, useState } from 'react';

import { Box, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { QueueEntryData } from '../../../interfaces/QueueEntry';
import { getQueueEntries, deleteQueueEntry } from '../../../services/book';

const QueueTable = () => {
  const [rows, setRows] = useState<{ id: number; title: string; user: string; createdAt: string; position: number }[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<GridRowId | null>(null);

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

  const handleDeleteClick = (id: number) => () => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      await deleteQueueEntry(Number(deleteId));
      setRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Book Title', width: 300 },
    { field: 'user', headerName: 'User', width: 200 },
    {
      field: 'position',
      headerName: 'Position',
      width: 100,
    },
    {
      field: 'createdAt',
      headerName: 'Reserved',
      width: 150,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id as number)}
          />,
        ];
      },
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
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this queue entry?</DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </article>
  );
};

export default QueueTable;
