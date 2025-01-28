import React, { useState, SyntheticEvent } from 'react';
import { BookInterface } from '../interfaces/Book';

interface BookFormProps {
  onSubmit: () => void;
  initialValues: BookInterface | null;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialValues }) => {
  const [title, setTitle] = useState(initialValues ? initialValues.title : '');
  const [authors, setAuthors] = useState(initialValues ? initialValues.authors : '');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState(initialValues ? initialValues.isbn : '');
  const [description, setDescription] = useState(initialValues ? initialValues.description : '');
  const [publishedDate, setPublishedDate] = useState(
    initialValues ? initialValues.publishedDate : '',
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    //const book = { title, author, genre, isbn, description, publish_year: parseInt(publishYear) };
    onSubmit(); // onSubmit(book);
    setTitle('');
    setAuthors('');
    setGenre('');
    setIsbn('');
    setDescription('');
    setPublishedDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="genre">Genre:</label>
        <input type="text" id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      </div>
      <div>
        <label htmlFor="isbn">ISBN:</label>
        <input type="text" id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="publishYear">Publish Year:</label>
        <input
          type="text"
          id="publishYear"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BookForm;
