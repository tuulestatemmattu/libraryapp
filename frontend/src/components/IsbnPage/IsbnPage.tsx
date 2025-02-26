import { useState } from 'react';
import Button from '@mui/material/Button';
import StyledInput from '../StyledInput/StyledInput';

import './IsbnPage.css';

interface IsbnProps {
  isbnCallHandler: (_isbn: string) => void;
  isbn_code: string;
}

const IsbnPage = ({ isbnCallHandler, isbn_code }: IsbnProps) => {
  const [isbn, setIsbn] = useState<string>(isbn_code);
  // eslint-disable-next-line no-undef
  const handleSubmitIsbn = (event: React.SyntheticEvent) => {
    event.preventDefault();

    isbnCallHandler(isbn);
    setIsbn('');
  };
  return (
    <div>
      <form onSubmit={handleSubmitIsbn}>
        <StyledInput label="isbn" value={isbn} setValue={setIsbn} />
        <br />
        <Button type="submit" className="isbn-submit-button">
          Search
        </Button>
      </form>
    </div>
  );
};

export default IsbnPage;
