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
isbnRouter.use(requireAdmin);

isbnRouter.post('/', async (req, res) => {
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
  } catch (error) {
    console.error('Google API error:', error);
    res.status(500).send({ message: 'Google API may be down.' }).end();
  }
});

export default isbnRouter;
