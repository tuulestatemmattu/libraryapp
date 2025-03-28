import TextField from '@mui/material/TextField';

import './StyledInput.css';

interface StyledInputProps {
  label: string;
  value: string;
  setValue: (arg0: string) => void;
  multiline?: boolean;
}

const StyledInput = ({ label, value, setValue, multiline}: StyledInputProps) => {
  return (
    <TextField
      className="styled-input"
      label={label}
      type="text"
      variant="standard"
      value={value}
      name="Isbn"
      onChange={({ target }) => setValue(target.value)}
      multiline={multiline}
    />
  );
};

export default StyledInput;
