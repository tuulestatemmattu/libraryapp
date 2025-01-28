import axios from 'axios';
import { apiBaseUrl } from '../constants';
const baseUrl = apiBaseUrl + '/isbn';
import { BookInterface } from '../interfaces/Book';

const getInfoFromIsbn = async (isbn: string):Promise<BookInterface> => {
    console.log(baseUrl)
    const resultData = (await axios.post(baseUrl, {isbn:isbn})).data;
    return resultData
};

export default getInfoFromIsbn;