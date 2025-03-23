import TextField from '@mui/material/TextField';

import './StyledInput.css';

interface StyledInputProps {
  label: string;
  value: string;
  setValue: (arg0: string) => void;
}

const StyledInput = ({ label, value, setValue }: StyledInputProps) => {
  return (
    <TextField
      className="styled-input"
      label={label}
      type="text"
      variant="standard"
      value={value}
      name="Isbn"
      onChange={({ target }) => setValue(target.value)}
    />
  );
};

export default StyledInput;
