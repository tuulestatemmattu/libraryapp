import React, { useState } from 'react';

interface BookFormProps {
  onSubmit: (book: { title: string; author: string; genre: string; isbn: string; description: string; publish_year: number }) => void;
  initialValues?: { title: string, authors: string, isbn: string, description:string, publishDate:string };
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit , initialValues}) => {
  const [title, setTitle] = useState(initialValues ? initialValues.title : '');
  const [author, setAuthor] = useState(initialValues ? initialValues.authors : '');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState(initialValues ? initialValues.isbn : '');
  const [description, setDescription] = useState(initialValues ? initialValues.description : '');
  const [publishYear, setPublishYear] = useState(initialValues ? initialValues.publishDate : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, author, genre, isbn, description, publish_year: parseInt(publishYear) });
    setTitle('');
    setAuthor('');
    setGenre('');
    setIsbn('');
    setDescription('');
    setPublishYear('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
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
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label htmlFor="publishYear">Publish Year:</label>
        <input type="text" id="publishYear" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BookForm;