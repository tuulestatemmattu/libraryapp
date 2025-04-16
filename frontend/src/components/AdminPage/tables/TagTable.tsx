import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import useMainStore from '../../../hooks/useMainStore';
import useRequireAdmin from '../../../hooks/useRequireAdmin';
import { FetchedTag } from '../../../interfaces/Tags';
import { addTag, deleteTag, updateTag } from '../../../services/tag';

import '../AdminPage.css';

const TagTable = () => {
  useRequireAdmin();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);

  const tags = useMainStore((state) => state.tags);
  const storeAddOrUpdateTag = useMainStore((state) => state.addOrUpdateTag);
  const storeDeleteTag = useMainStore((state) => state.deleteTag);

  const rows = tags
    .map((t: FetchedTag) => ({
      id: t.id,
      name: t.name,
    }))
    .sort((a: FetchedTag, b: FetchedTag) => a.id - b.id);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      await deleteTag(Number(deleteId));
      storeDeleteTag(Number(deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try {
      const updatedRow = await updateTag(newRow as FetchedTag);
      storeAddOrUpdateTag(updatedRow);
      return updatedRow;
    } catch (error) {
      console.error('Update failed:', error);
      return newRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleAddTag = async () => {
    if (tags.some((tag) => tag.name === newTagName)) {
      setDuplicateDialogOpen(true);
      return;
    }
    const newTag = { name: newTagName };
    const createdTag = await addTag(newTag);
    storeAddOrUpdateTag(createdTag);
    setOpen(false);
    setNewTagName('');
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200, editable: true, flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <article>
      <Box sx={{ textAlign: 'center' }}>
        <h1>Tags</h1>
      </Box>
      <Paper className="admin-table">
        <DataGrid
          disableVirtualization
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          editMode="row"
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          sx={{
            '& .MuiDataGrid-row.MuiDataGrid-row--editing': {
              '& .MuiDataGrid-cell': {
                backgroundColor: 'rgba(255, 235, 60, 0.5) !important',
              },
            },
            border: 1,
          }}
          slots={{
            toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarQuickFilter />
                <GridToolbarColumnsButton />
                <GridToolbarDensitySelector slotProps={{ tooltip: { title: 'Change density' } }} />
                <Box sx={{ flexGrow: 1 }} />
                <Button color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                  Add Tag
                </Button>
              </GridToolbarContainer>
            ),
          }}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            type="text"
            fullWidth
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTag} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this tag?</DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={duplicateDialogOpen} onClose={() => setDuplicateDialogOpen(false)}>
        <DialogTitle>Duplicate Tag</DialogTitle>
        <DialogContent>This tag already exists. Please enter a different name.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </article>
  );
};

export default TagTable;
