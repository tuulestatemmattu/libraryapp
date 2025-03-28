import React, { useCallback } from 'react';

import { Box, ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import { debounce } from '@mui/material/utils';

import './CopiesInput.css';

interface CopiesInputProps {
  copies: number;
  setCopies: React.Dispatch<React.SetStateAction<number>>;
}

const CopiesInput = ({ copies, setCopies }: CopiesInputProps) => {
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
    <div>
      <ButtonGroup variant="outlined" className="copies-input-group">
        <Button onClick={handleDecrement} className="copies-input-decrement">
          –
        </Button>
        <Box className="copies-input-value">{copies}</Box>
        <Button onClick={handleIncrement} className="copies-input-increment">
          +
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default CopiesInput;
