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

const BookList = () => {
    const [books, setBooks] = useState<Book[]>([])

    useEffect(() => {
      axios.get(`${apiBaseUrl}/books`)
        .then((res) => {
          setBooks(res.data)
        })
    })

    return (
        <div>
            {books.map((book) =>
                <BookListItem key={book.id} book={book} />
            )}
        </div>
    )
}

export default BookList;
