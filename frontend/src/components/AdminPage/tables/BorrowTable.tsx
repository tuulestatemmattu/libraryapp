import { useEffect, useState } from 'react';

import { Box, Button, Paper } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { BorrowData } from '../../../interfaces/Borrow';
import { getBorrows } from '../../../services/book';

const parseDueDate = (borrowed: string) => {
  const result = new Date(borrowed);
  result.setDate(result.getDate() + 30);

  return result.toISOString().split('T')[0];
};

const parseDaysLeft = (borrowed: string) => {
  const borrowedDate = new Date(borrowed);
  borrowedDate.setDate(borrowedDate.getDate() + 30); // Add 30 days to get the due date

  const today = new Date();

  // Calculate the difference in milliseconds and convert to days
  const diffTime = borrowedDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  return diffDays;
};

const BorrowTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getBorrows().then((result) =>
      setRows(
        result.map((b: BorrowData) => {
          return {
            id: b.id,
            title: b.book.title,
            user: b.user.email,
            borrowedDate: b.borrowedDate.slice(0, 10),
            due: parseDueDate(b.borrowedDate),
            days: parseDaysLeft(b.borrowedDate),
          };
        }),
      ),
    );
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Book Title', width: 400 },
    { field: 'user', headerName: 'User', width: 250 },
    { field: 'borrowedDate', headerName: 'Borrowed', width: 150 },
    { field: 'due', headerName: 'Due date', width: 150 },
    {
      field: 'days',
      headerName: 'Days left',
      width: 100,
      renderCell: (params) => {
        let textColor = '';

        if (params.value > 15) {
          textColor = '#66bb6a'; // Light Green (30-15 days left)
        } else if (params.value > 0) {
          textColor = '#ff9800'; // Light Orange (15-5 days left)
        } else {
          textColor = '#f44336'; // Soft Red (Overdue)
        }

        return <p style={{ color: textColor, fontWeight: 'bold' }}>{params.value} days</p>;
      },
    },

    {
      field: 'return',
      headerName: 'Return',
      width: 200,
      renderCell: (params) => <Button onClick={() => console.log(params)}>Return this book</Button>,
    },
  ];

  const paginationModel = { page: 0, pageSize: 20 };

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
        <h1>Borrow data</h1>
      </Box>
      <Paper sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20, 50]}
          sx={{ border: 1 }}
          slots={{
            toolbar: CustomToolBar,
          }}
        />
      </Paper>
    </div>
  );
};

export default BorrowTable;
