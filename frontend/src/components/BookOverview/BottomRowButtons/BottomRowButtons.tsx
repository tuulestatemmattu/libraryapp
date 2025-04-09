import React from 'react';

import Button from '@mui/material/Button';

import useMainStore from '../../../hooks/useMainStore';
import { FetchedBook } from '../../../interfaces/Book';

interface BottomRowButtonsProps {
  book: FetchedBook;
  handleEdit: (id: number) => void;
  handleReturn: (id: number) => void;
  handleExtend: (id: number) => void;
  handleBorrow: (id: number) => void;
  handleAddToQueue: (id: number) => void;
  handleRemoveFromQueue: (id: number) => void;
}

const BottomRowButtons: React.FC<BottomRowButtonsProps> = ({
  book,
  handleEdit,
  handleReturn,
  handleExtend,
  handleBorrow,
  handleAddToQueue,
  handleRemoveFromQueue,
}) => {
  const profile = useMainStore((state) => state.profile);

  return (
    <>
      {profile?.admin && (
        <Button variant="contained" onClick={() => handleEdit(book.id)}>
          Edit
        </Button>
      )}
      {book.status === 'borrowed' || book.status === 'late' ? (
        <>
          <Button variant="contained" onClick={() => handleReturn(book.id)}>
            Return
          </Button>
          <Button variant="contained" onClick={() => handleExtend(book.id)}>
            Extend
          </Button>
        </>
      ) : book.status === 'available' || book.status === 'ready' ? (
        <Button variant="contained" onClick={() => handleBorrow(book.id)}>
          Borrow
        </Button>
      ) : book.status === 'unavailable' ? (
        <Button variant="contained" onClick={() => handleAddToQueue(book.id)}>
          Reserve
        </Button>
      ) : book.status === 'reserved' ? (
        <Button variant="contained" onClick={() => handleRemoveFromQueue(book.id)}>
          Unreserve
        </Button>
      ) : (
        <> </>
      )}
    </>
  );
};

export default BottomRowButtons;
