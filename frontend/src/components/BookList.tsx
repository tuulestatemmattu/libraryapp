import BookListItem from './BookListItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  publish_year: string;
}

const filterOptions: (keyof Book | 'all')[] = ['all', 'title', 'author', 'publish_year'];

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState<keyof Book | 'all'>('all');

  useEffect(() => {
    axios.get(`${apiBaseUrl}/books`).then((res) => {
      setBooks(res.data);
    });
  }, []);

  const filteredBooks = books.filter((book) =>
    filterType === 'all'
      ? Object.values(book).some((value) =>
          String(value).toLowerCase().includes(filter.toLowerCase()),
        )
      : String(book[filterType]).toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as keyof Book | 'all')}
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option === 'all'
                ? 'All Fields'
                : option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={`Filter by ${filterType === 'all' ? 'any field' : filterType.replace('_', ' ')}`}
        />
      </div>
      <div>
        {filteredBooks.map((book) => (
          <BookListItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookList;
