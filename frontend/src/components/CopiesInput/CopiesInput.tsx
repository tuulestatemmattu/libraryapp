import React, { useCallback } from 'react';
import { Button, ButtonGroup, debounce } from '@mui/material';

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
        <span>{copies}</span>
        <Button onClick={handleIncrement}>+</Button>
      </ButtonGroup>
    </div>
  );
};

export default CopiesInput;
