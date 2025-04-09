import axios from 'axios';
import express from 'express';

import { requireAdmin } from '../util/middleware/requireAdmin';

interface googleApiResponse {
  totalItems: string;
  items: {
    volumeInfo: {
      title: string;
      authors: string[];
      publishedDate: string;
      description: string;
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
        small?: string;
        medium?: string;
        large?: string;
        extraLarge?: string;
      };
    };
  }[];
}

const isbnRouter = express.Router();

isbnRouter.post('/', requireAdmin, async (req, res) => {
  const { isbn } = req.body;
  const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;

  try {
    // Get the book data from the google api
    const responseData = (await axios.get<googleApiResponse>(apiUrl)).data;
    if (responseData.totalItems == '0') {
      res.status(400).send({ message: 'Did not find any works relating to this isbn.' }).end();
    } else {
      const volumeInfo = responseData.items[0].volumeInfo;
      const book = {
        title: volumeInfo.title,
        authors: volumeInfo.authors.join(', '),
        publishedDate: volumeInfo.publishedDate,
        isbn,
        description: volumeInfo.description,
        imageLinks: volumeInfo.imageLinks,
      };

      res.send(book);
    }
  } catch (error: unknown) {
    console.error('Google API error:', error);
    res.status(500).send({ message: 'Google API may be down.' }).end();
  }
});

interface BookListApiResponse {
  totalItems: number;
  items: {
    volumeInfo: {
      title?: string;
      authors?: string[];
      industryIdentifiers?: {
        type: string;
        identifier: string;
      }[];
    };
  }[];
}

isbnRouter.post('/search', async (req, res) => {
  const { title, author, isbn } = req.body;

  const query = encodeURIComponent(
    (title ? 'intitle:' + title + ' ' : '') +
      (author ? 'inauthor:' + author + ' ' : '') +
      (isbn ? 'isbn:' + isbn : ''),
  );

  if (!query) {
    res.status(400).send({ message: 'Please provide a title, author, or ISBN.' }).end();
    return;
  }

  const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + query;

  try {
    const responseData = (await axios.get<BookListApiResponse>(apiUrl)).data;
    if (responseData.totalItems === 0) {
      res.json([]);
      return;
    }
    const bookList = responseData.items.map((item) => {
      const book = {
        title: item.volumeInfo.title ? item.volumeInfo.title : '',
        authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : '',
        isbn: item.volumeInfo.industryIdentifiers
          ? (item.volumeInfo.industryIdentifiers.find((identifier) => identifier.type === 'ISBN_13')
              ?.identifier ?? '')
          : '',
      };
      return book;
    });
    res.json(bookList);
  } catch (error: unknown) {
    console.error('Google API error:', error);
    res.status(500).send({ message: 'Internal server error.' }).end();
  }
});

export default isbnRouter;
