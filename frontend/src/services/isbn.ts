import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/isbn';

interface book {
    authors: string[],
    title: string,
    isbn: string,
    publishedYear: string
};

const getInfoFromIsbn = async (isbn: string):Promise<book> => {
    console.log(baseUrl)
    const resultData = (await axios.post(baseUrl, {isbn:isbn})).data;
    return resultData
};

export default getInfoFromIsbn;