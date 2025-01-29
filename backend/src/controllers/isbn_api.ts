import express from 'express';
import axios from 'axios';
import { CustomRequest, tokenExtractor } from '../util/middleware';

interface googleApiResponse {
  totalItems: string;
  items: {
    volumeInfo: {
      title: string;
      authors: string[];
      publishedDate: string;
      description: string;
      imageLinks: { smallThumbnail: string; thumbnail: string };
    };
  }[];
}



const isbnRouter = express.Router();

isbnRouter.post('/',tokenExtractor, async (req, res) => {
  console.log((req as CustomRequest).UserId)
  const { isbn } = req.body;
  const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;

  // Get the book data from the google api
  console.log('requesting data from:', apiUrl);
  const responseData = (await axios.get<googleApiResponse>(apiUrl)).data;
  if (responseData.totalItems == '0') {
    res.status(400).send({message: 'Did not find any works relating to this isbn.'}).end()
  } else {
    const volumeInfo = responseData.items[0].volumeInfo
    const book = {
      title: volumeInfo.title,
      authors: volumeInfo.authors.join(', '),
      publishedDate: volumeInfo.publishedDate,
      isbn,
      description: volumeInfo.description,
      images: volumeInfo.imageLinks,
    };

    res.send(book);
  }
});

export default isbnRouter;
