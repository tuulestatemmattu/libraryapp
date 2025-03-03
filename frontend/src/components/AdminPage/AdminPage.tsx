import React, { useEffect, useState } from 'react';
import { getUsers, promoteUsers } from '../../services/admin';
import Profile from '../../interfaces/Profile';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import useRequireAdmin from '../../hooks/useRequireAdmin';

const AdminPage = () => {
  useRequireAdmin();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getUsers().then((result) =>
      setRows(
        result.map((u: Profile) => {
          return { id: u.email, name: u.name, email: u.email, admin: u.admin };
        }),
      ),
    );
  }, []);

  const handlePromotion = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(selected);

    for (const user of selected) {
      try {
        const result = await promoteUsers(user);
        console.log(result);
      } catch {
        console.error(`Failed to promote ${user}`);
      }
    }
    const result = await getUsers();
    setRows(
      result.map((u: Profile) => ({
        id: u.email,
        name: u.name,
        email: u.email,
        admin: u.admin,
      })),
    );
    setSelected([]);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'admin', headerName: 'Admin', width: 130 },
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
        <Button onClick={handlePromotion}>Promote Selected Users</Button>
      </GridToolbarContainer>
    );
  };

  return (
    <div>
      <h1>users</h1>
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

export default AdminPage;
