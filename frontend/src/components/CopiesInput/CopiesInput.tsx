import React, { useCallback } from 'react';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { debounce } from '@mui/material/utils';

interface CopiesInputProps {
  copies: number;
  setCopies: React.Dispatch<React.SetStateAction<number>>;
}

const CopiesInput: React.FC<CopiesInputProps> = ({ copies, setCopies }) => {
  const handleDecrement = useCallback(
    debounce(() => {
      if (copies > 1) {
        setCopies((copies) => copies - 1);
      }
    }, 20),
    [copies],
  );

  const handleIncrement = useCallback(
    debounce(() => {
      setCopies((copies) => copies + 1);
    }, 20),
    [copies],
  );

  return (
    <div className="copies-input">
      <span>Copies: </span>
      <ButtonGroup variant="contained">
        <Button onClick={handleDecrement}>-</Button>
        <Box sx={{ padding: '10px' }}>{copies}</Box>
        <Button onClick={handleIncrement}>+</Button>
      </ButtonGroup>
    </div>
  );
};

export default CopiesInput;
