import TextField from '@mui/material/TextField';

import './StyledTextField.css';

interface StyledTextFieldProps {
  label: string;
  value: string;
  setValue: (arg0: string) => void;
  multiline?: boolean;
}

const StyledTextField = ({ label, value, setValue, multiline }: StyledTextFieldProps) => {
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

export default StyledTextField;
