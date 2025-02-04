import React, { useState, SyntheticEvent } from 'react';
import { BookInterface } from '../interfaces/Book';

interface BookFormProps {
  onSubmit: (book: BookInterface) => Promise<{ data: BookInterface; status: number }>;
  initialValues: BookInterface | null;
}

const AddBookForm: React.FC<BookFormProps> = ({ onSubmit, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [authors, setAuthors] = useState(initialValues?.authors || '');
  const [isbn, setIsbn] = useState(initialValues?.isbn || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [publishedDate, setPublishedDate] = useState(initialValues?.publishedDate || '');
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const book: BookInterface = {
      title,
      authors,
      isbn,
      description,
      publishedDate,
    };

    try {
      const response = await onSubmit(book);

      if (response?.status === 201 || response?.status === 200) {
        setNotification('New book added successfully!');
        setTitle('');
        setAuthors('');
        setIsbn('');
        setDescription('');
        setPublishedDate('');
      } else {
        setNotification('Failed to adding the book. Please try again!');
      }
    } catch (error) {
      setNotification('Error ocurred while adding a book');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleClear = () => {
    setTitle('');
    setAuthors('');
    setIsbn('');
    setDescription('');
    setPublishedDate('');
  };

  return (
    <div>
      {notification && (
        <div style={{ background: 'lightgreen', padding: '10px', marginBottom: '10px' }}>
          {notification} {/* #TODO: move styling to css mui element for notif */}
        </div>
      )}
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
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;
