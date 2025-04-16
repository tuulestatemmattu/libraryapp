import { useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { QueueEntryData } from '../../../interfaces/QueueEntry';
import { deleteQueueEntry, getQueueEntries } from '../../../services/book';

import '../AdminPage.css';

const QueueTable = () => {
  const [rows, setRows] = useState<
    { id: number; title: string; user: string; createdAt: string; position: number }[]
  >([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    getQueueEntries()
      .then((result) =>
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
      )
      .catch((error: unknown) => {
        console.error('Error fetching queue entries:', error);
      });
  }, []);

  const handleDeleteClick = (id: number) => () => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      await deleteQueueEntry(Number(deleteId));

      const updatedQueue = await getQueueEntries();
      setRows(
        updatedQueue.map((q: QueueEntryData) => ({
          id: q.id,
          title: q.book.title,
          user: q.user.email,
          createdAt: q.createdAt.slice(0, 10),
          position: q.position,
        })),
      );

      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Book Title', width: 300, flex: 1 },
    { field: 'user', headerName: 'User', width: 250 },
    {
      field: 'position',
      headerName: 'Position',
      width: 100,
    },
    {
      field: 'createdAt',
      headerName: 'Reserved',
      width: 100,
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
      <Paper className="admin-table">
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
