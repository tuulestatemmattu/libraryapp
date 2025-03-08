import { useState } from 'react';

import Button from '@mui/material/Button';

import StyledInput from '../StyledInput/StyledInput';
import React from 'react';

import './IsbnPage.css';

interface IsbnProps {
  isbnHandler: (_isbn: string) => void;
}

const IsbnPage = ({ isbnHandler }: IsbnProps) => {
  const [isbn, setIsbn] = useState<string>('');

  const handleSubmitIsbn = (event: React.SyntheticEvent) => {
    event.preventDefault();
    isbnHandler(isbn);
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
