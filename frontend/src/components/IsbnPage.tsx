import { useState } from 'react';
import Button from '@mui/material/Button';
import StyledInput from './StyledInput';

interface IsbnProps {
  isbnCallHandler: (_isbn: string) => void;
}

const IsbnPage = ({ isbnCallHandler }: IsbnProps) => {
  const [isbn, setIsbn] = useState<string>('');
  // eslint-disable-next-line no-undef
  const handleSubmitIsbn = (event: React.SyntheticEvent) => {
    event.preventDefault();

    isbnCallHandler(isbn);
    setIsbn('');
  };
  return (
    <div>
      <form onSubmit={handleSubmitIsbn}>
        <StyledInput lable="isbn" value={isbn} setValue={setIsbn} />
        <br />
        <Button type="submit">Search</Button>
      </form>
    </div>
  );
};

export default IsbnPage;
