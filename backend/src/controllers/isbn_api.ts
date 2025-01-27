import express from 'express';
import axios from 'axios';

const isbnRouter = express.Router();

interface ResponseAuthor {
    name: string
}

interface AuthorOfBook {
    key: string
}

interface ResponseBook {
    authors: {key: string}[],
    title: string,
    publish_date: string
    
}

isbnRouter.post('/', async (req, res) => {
    const apiBaseUrl = 'https://openlibrary.org/'
    const { isbn } = req.body

    // Get the book data from the openlibrary api
    const responseData = (await axios.get<ResponseBook>(apiBaseUrl + '/isbn/' + isbn + '.json')).data

    // Get the authors data from the openlibrary api
    let authors = new Array<string>(responseData.authors.length);
    await Promise.all(
        responseData.authors.map(async (author: AuthorOfBook, i: number) => {
            const { name } = (await axios.get<ResponseAuthor>(apiBaseUrl + author.key)).data
            authors[i] = name
        })
    )

    const book = {
        // concat the list of string into one string
        authors: authors.join(', '),
        title: responseData.title,
        publishedYear: responseData.publish_date.split(', ')[1],
        isbn: isbn
    }
    
    res.send(book)
})

export default isbnRouter;