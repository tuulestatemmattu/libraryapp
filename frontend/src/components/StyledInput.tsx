import TextField from '@mui/material/TextField';
interface InputProps {
  lable: string;
  value: string;
  setValue: (arg0: string) => void;
}

const StyledInput = ({ lable, value, setValue }: InputProps) => {
  return (
    <TextField
      margin="normal"
      label={lable}
      type="text"
      variant="standard"
      value={value}
      name="Isbn"
      onChange={({ target }) => setValue(target.value)}
      sx={{ width: 0.9, maxWidth: 700 }}
    />
  );
};

export default StyledInput;
