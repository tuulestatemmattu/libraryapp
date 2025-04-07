import React, { useEffect } from 'react';

import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Tooltip,
} from '@mui/material';
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
import { AdminViewBook, FetchedBook } from '../../../interfaces/Book';
import { FetchedTag } from '../../../interfaces/Tags';
import { deleteBook, updateBook } from '../../../services/book';
import SelectTags from './SelectTags';

const BookTable = () => {
  const queryParams = new URLSearchParams(location.search);
  const bookIdParam = Number(queryParams.get('bookId'));

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [deleteId, setDeleteId] = React.useState<string | number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const books = useMainStore((state) => state.books);
  const storeAddOrUpdateBook = useMainStore((state) => state.addOrUpdateBook);
  const storeDeleteBook = useMainStore((state) => state.deleteBook);

  const toAdminViewBook = (book: FetchedBook): AdminViewBook => {
    return {
      id: book.id,
      title: book.title,
      authors: book.authors,
      isbn: book.isbn,
      publishedDate: book.publishedDate,
      description: book.description,
      location: book.location,
      copies: book.copies,
      copiesAvailable: book.copiesAvailable,
      imageLink: book.imageLink,
      tags: book.tags,
    };
  };

  const rows = books.map((book) => toAdminViewBook(book));

  useEffect(() => {
    if (bookIdParam && rows.map((book) => book.id).includes(bookIdParam)) {
      setRowModesModel({
        ...rowModesModel,
        [bookIdParam]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
      });
    }
  }, []);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
    });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteBook(Number(deleteId));
    storeDeleteBook(Number(deleteId));
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = await updateBook(newRow as AdminViewBook);
    storeAddOrUpdateBook(updatedRow);
    return toAdminViewBook(updatedRow);
  };

  const processRowError = (error: Error) => {
    console.error(error);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 250, editable: true },
    { field: 'authors', headerName: 'Authors', width: 200, editable: true },
    { field: 'isbn', headerName: 'ISBN', width: 180, editable: true },
    { field: 'publishedDate', headerName: 'Published Date', width: 150, editable: true },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      editable: true,
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
      renderEditCell: (params) => {
        return (
          <TextField
            value={params.value || ''}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            multiline
            rows={4}
            variant="outlined"
            fullWidth
          />
        );
      },
    },
    { field: 'location', headerName: 'Location', width: 150, editable: true },
    { field: 'copies', headerName: 'Copies', width: 150, editable: true },
    { field: 'copiesAvailable', headerName: 'Copies Available', width: 150, editable: false },
    { field: 'imageLink', headerName: 'Image Link', width: 150, editable: true },
    {
      field: 'tags',
      headerName: 'Tags',
      display: 'flex',
      width: 200,
      editable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, padding: 0.5 }}>
          {params.row.tags.map((tag: FetchedTag) => (
            <Chip key={tag.id} label={tag.name} size="small" />
          ))}
        </Box>
      ),
      renderEditCell: (params) => <SelectTags {...params} />,
    },
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
    <article>
      <Box sx={{ textAlign: 'center' }}>
        <h1>Books</h1>
      </Box>
      <Paper sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          getRowHeight={() => 'auto'}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={processRowError}
          sx={{
            '& .MuiDataGrid-row.MuiDataGrid-row--editing': {
              '& .MuiDataGrid-cell': {
                backgroundColor: 'rgba(255, 235, 60, 0.5) !important',
              },
            },
            border: 1,
          }}
          slots={{
            toolbar: CustomToolBar,
          }}
        />
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={() => handleDeleteCancel()}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this book entry entirely?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </article>
  );
};

export default BookTable;
