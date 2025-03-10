import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import useRequireAdmin from '../../../hooks/useRequireAdmin';
import { FetchedTag } from '../../../interfaces/Tags';
import { getTags } from '../../../services/tag';

const TagTable = () => {
  useRequireAdmin();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getTags().then((result) =>
      setRows(
        result.map((t: FetchedTag) => {
          return { id: t.name, name: t.name };
        }),
      ),
    );
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { ...GRID_CHECKBOX_SELECTION_COL_DEF },
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
        <h1>Tags</h1>
      </Box>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          rowSelectionModel={selected}
          onRowSelectionModelChange={(ids) => setSelected(ids.map((id) => id.toString()))}
          sx={{ border: 1 }}
          slots={{
            toolbar: CustomToolBar,
          }}
        />
      </Paper>
    </div>
  );
};

export default TagTable;
