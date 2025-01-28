import express from 'express';
import axios from 'axios';

interface BookResponse {
    items: {volumeInfo:{title:string, authors: string[], publishedDate: string, description: string, imageLinks:{smallThumbnail: string, thumbnail: string}}}[]
}

const isbnRouter = express.Router();

isbnRouter.post('/', async (req, res) => {
    const { isbn } = req.body
    const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn

    // Get the book data from the openlibrary api
    console.log('requesting data from:', apiUrl)
    const volumeInfo = (await axios.get<BookResponse>(apiUrl)).data.items[0].volumeInfo
    const book = {
        title: volumeInfo.title,
        authors: volumeInfo.authors.join(', '),
        publishedDate: volumeInfo.publishedDate,
        isbn,
        description: volumeInfo.description,
        images: volumeInfo.imageLinks
    }

    res.send(book)
})

export default isbnRouter;