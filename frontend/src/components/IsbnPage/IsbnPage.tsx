import { useState } from 'react';
import React from 'react';

import Button from '@mui/material/Button';

import StyledInput from '../StyledInput/StyledInput';

import './IsbnPage.css';

interface IsbnPageProps {
  isbnHandler: (isbn: string) => void;
}

const IsbnPage = ({ isbnHandler }: IsbnPageProps) => {
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
