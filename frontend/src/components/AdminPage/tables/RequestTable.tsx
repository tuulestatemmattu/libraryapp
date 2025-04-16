import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModesModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { useNotification } from '../../../context/NotificationsProvider/NotificationProvider';
import useMainStore from '../../../hooks/useMainStore';
import useRequireAdmin from '../../../hooks/useRequireAdmin';
import { FetchedRequest } from '../../../interfaces/Request';
import { deleteBookRequest, modifyRequestStatus } from '../../../services/request';

import '../AdminPage.css';

const RequestTable = () => {
  useRequireAdmin();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const { showNotification } = useNotification();

  const bookRequests = useMainStore((state) => state.bookRequests);
  const storeDeleteBookRequest = useMainStore((state) => state.deleteBookRequest);
  const storeUpdateBookRequest = useMainStore((state) => state.updateBookRequest);

  const rows = bookRequests
    .map((bookRequest: FetchedRequest) => ({
      id: bookRequest.id,
      title: bookRequest.title,
      author: bookRequest.author,
      isbn: bookRequest.isbn,
      user_email: bookRequest.user.email,
      status: bookRequest.status,
    }))
    .sort((a, b) => a.id - b.id);

  const handleDeleteClick = (id: GridRowId) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleAcceptClick = async (id: GridRowId) => {
    const updatedRequest = await modifyRequestStatus(Number(id), 'accepted');
    storeUpdateBookRequest(updatedRequest);
    showNotification('Book request accepted', 'success');
  };

  const handleRejectClick = async (id: GridRowId) => {
    const updatedRequest = await modifyRequestStatus(Number(id), 'rejected');
    storeUpdateBookRequest(updatedRequest);
    showNotification('Book request rejected', 'success');
  };

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      await deleteBookRequest(Number(deleteId));
      storeDeleteBookRequest(Number(deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'author', headerName: 'Authors', width: 200 },
    { field: 'isbn', headerName: 'ISBN', width: 150 },
    { field: 'user_email', headerName: 'User', width: 200 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <>
            <GridActionsCellItem
              icon={<CheckIcon />}
              label="Accept"
              onClick={() => handleAcceptClick(id)}
            />
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(id)}
            />
            <GridActionsCellItem
              icon={<ClearIcon />}
              label="Reject"
              onClick={() => handleRejectClick(id)}
            />
          </>,
        ];
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <article>
      <Box sx={{ textAlign: 'center' }}>
        <h1>Book Requests</h1>
      </Box>
      <Paper className="admin-table">
        <DataGrid
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          editMode="row"
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          sx={{ border: 1 }}
          slots={{
            toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarQuickFilter />
                <GridToolbarColumnsButton />
                <GridToolbarDensitySelector slotProps={{ tooltip: { title: 'Change density' } }} />
                <Box sx={{ flexGrow: 1 }} />
              </GridToolbarContainer>
            ),
          }}
        />
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this request?</DialogContent>
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

export default RequestTable;
