import { useEffect, useState } from 'react';
import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Paper, Tooltip } from '@mui/material';
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
import { FetchedBook } from '../../../interfaces/Book';

interface BookTableRow {
  id: number;
  title: string;
  authors: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
  copies: number;
  imageLink?: string;
  tags: string[];
}
const BookTable = () => {
  const [rows, setRows] = useState<BookTableRow[]>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const books = useMainStore((state) => state.books);
  const tags = useMainStore((state) => state.tags);

  useEffect(() => {
    setRows(
      books.map((b: FetchedBook) => {
        return {
          id: b.id,
          title: b.title,
          authors: b.authors,
          isbn: b.isbn,
          publishedDate: b.publishedDate,
          description: b.description,
          location: b.location,
          copies: b.copies,
          imageLink: b.imageLink,
          tags: b.tags.map((tag) => tag.name),
        };
      }),
    );
  }, []);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try {
      const updatedRow = await updateBook(newRow as FetchedBook);
      storeUpdateBook(updatedRow);
      return updatedRow;
    } catch (error) {
      console.error('Update failed:', error);
      return newRow;
    }
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
    },
    { field: 'location', headerName: 'Location', width: 150, editable: true },
    { field: 'copies', headerName: 'Copies', width: 150, editable: true },
    { field: 'imageLink', headerName: 'Image Link', width: 150, editable: true },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: tags.map((tag) => tag.name),
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
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
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
