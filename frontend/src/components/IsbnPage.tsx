import { useState } from 'react';
// import BookForm from './BookForm';
interface IsbnProps {
  isbnCallHandler: (a: string) => void;
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
        <div>
          Isbn
          <input
            type="text"
            value={isbn}
            name="Isbn"
            onChange={({ target }) => setIsbn(target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default IsbnPage;
