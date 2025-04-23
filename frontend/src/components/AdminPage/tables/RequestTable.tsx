import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { TextField } from '@mui/material';
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

type DialogueOption = 'accept' | 'reject';

const RequestTable = () => {
  useRequireAdmin();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [open, setOpen] = useState(false);
  const [dialogueOption, setDialogueOption] = useState<DialogueOption>('accept');
  const [id, setId] = useState<number | null>(null);
  const [userMessage, setUserMessage] = useState('');
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
      user_emails: bookRequest.user_emails,
      request_count: bookRequest.request_count,
      status: bookRequest.status,
    }))
    .sort((a, b) => a.request_count - b.request_count);

  const handleDeleteClick = (id: GridRowId) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleAcceptClick = async (id: number | null) => {
    if (id) {
      const updatedRequest = await modifyRequestStatus(id, userMessage, 'accepted');
      storeUpdateBookRequest(updatedRequest);
      showNotification('Book request accepted', 'success');
      setOpen(false);
      setUserMessage('');
      setId(null);
    }
  };

  const handleRejectClick = async (id: number | null) => {
    if (id) {
      const updatedRequest = await modifyRequestStatus(id, userMessage, 'rejected');
      storeUpdateBookRequest(updatedRequest);
      showNotification('Book request rejected', 'success');
      setOpen(false);
      setUserMessage('');
      setId(null);
    }
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
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'author', headerName: 'Authors', width: 200 },
    { field: 'isbn', headerName: 'ISBN', width: 150 },
    { field: 'user_emails', headerName: 'Users', width: 200 },
    { field: 'request_count', headerName: 'Request Count', width: 150 },
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
              onClick={() => {
                setId(Number(id));
                setDialogueOption('accept');
                setOpen(true);
              }}
            />
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(id)}
            />
            <GridActionsCellItem
              icon={<ClearIcon />}
              label="Reject"
              onClick={() => {
                setId(Number(id));
                setDialogueOption('reject');
                setOpen(true);
              }}
            />
          </>,
        ];
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 20 };

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
          initialState={{
            pagination: { paginationModel },
            sorting: { sortModel: [{ field: 'request_count', sort: 'desc' }] },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {dialogueOption === 'accept' ? 'Accept request' : 'Reject request'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Message to user"
            type="text"
            fullWidth
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              dialogueOption === 'accept' ? handleAcceptClick(id) : handleRejectClick(id)
            }
            color="primary"
          >
            {dialogueOption === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </article>
  );
};

export default RequestTable;
