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
import { getBorrows, returnBook } from '../../../services/book';

const BorrowTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getBorrows()
      .then((result) =>
        setRows(
          result.map((b: BorrowData) => {
            return {
              id: b.id,
              title: b.book.title,
              user: b.user.email,
              borrowedDate: b.borrowedDate.slice(0, 10),
              due: b.dueDate.slice(0, 10),
              days: b.daysLeft,
              bookId: b.book.id,
              active: b.active,
            };
          }),
        ),
      )
      .catch((error: unknown) => {
        console.error('Error fetching borrows:', error);
      });
  }, []);

  const handleReturn = async (id: number) => {
    try {
      await returnBook(id); // Ensure the return is completed before fetching new data
      console.log(`Book with ID ${id} returned successfully.`);

      const result = await getBorrows(); // Fetch updated borrow list

      setRows(
        result.map((b: BorrowData) => ({
          id: b.id,
          title: b.book.title,
          user: b.user.email,
          borrowedDate: b.borrowedDate.slice(0, 10),
          due: b.dueDate.slice(0, 10),
          days: b.daysLeft,
          bookId: b.book.id,
          active: b.active,
        })),
      );
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Book Title', width: 400 },
    { field: 'user', headerName: 'User', width: 250 },
    {
      field: 'borrowedDate',
      headerName: 'Borrowed',
      width: 150,
    },
    {
      field: 'due',
      headerName: 'Due date',
      width: 150,
      valueFormatter: (_value, row) => {
        if (!row.active) {
          return 'Returned';
        }
      },
    },
    {
      field: 'days',
      headerName: 'Days left',
      width: 100,
      renderCell: (params) => {
        if (!params.row.active) {
          return <span>-</span>;
        } else {
          let textColor = '';

          if (params.value > 15) {
            textColor = '#66bb6a'; // Light Green (30-15 days left)
          } else if (params.value > 0) {
            textColor = '#ff9800'; // Light Orange (15-5 days left)
          } else {
            textColor = '#f44336'; // Soft Red (Less than 5 days or overdue)
          }

          return <span style={{ color: textColor, fontWeight: 'bold' }}>{params.value} days</span>;
        }
      },
    },

    {
      field: 'return',
      headerName: 'Return',
      width: 200,
      renderCell: (params) => {
        if (params.row.active == true) {
          return <Button onClick={() => handleReturn(params.row.bookId)}>Return this book</Button>;
        } else {
          return <span>Loan is not active</span>;
        }
      },
    },
    { field: 'active', headerName: 'Active', width: 100 },
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
        <h1>Borrow data</h1>
      </Box>
      <Paper sx={{ height: 'auto', width: '100%' }}>
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
    </article>
  );
};

export default BorrowTable;
