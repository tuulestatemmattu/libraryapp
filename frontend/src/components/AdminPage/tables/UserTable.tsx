import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

import { useNotification } from '../../../context/NotificationsProvider/NotificationProvider';
import useRequireAdmin from '../../../hooks/useRequireAdmin';
import Profile from '../../../interfaces/Profile';
import { getUsers, promoteUsers } from '../../../services/admin';

const UserTable = () => {
  useRequireAdmin();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const { showNotification } = useNotification();

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
        showNotification('User promoted successfully!', 'success');
      } catch {
        showNotification(`Failed to promote ${user}`, 'error');
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
    { field: 'name', headerName: 'Name', width: 200 },
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
      <Box sx={{ textAlign: 'center' }}>
        <h1>Users</h1>
      </Box>
      <Paper sx={{ height: 'auto', width: '100%' }}>
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

export default UserTable;
