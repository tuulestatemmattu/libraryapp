import TextField from '@mui/material/TextField';
import './StyledInput.css';

interface InputProps {
  lable: string;
  value: string;
  setValue: (arg0: string) => void;
}

const StyledInput = ({ lable, value, setValue }: InputProps) => {
  return (
    <TextField
      className="styled-input"
      label={lable}
      type="text"
      variant="standard"
      value={value}
      name="Isbn"
      onChange={({ target }) => setValue(target.value)}
    />
  );
};

export default StyledInput;
