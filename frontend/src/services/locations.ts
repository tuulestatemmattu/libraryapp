import axios from 'axios';

import { apiBaseUrl } from '../constants';

const getLocations = async (): Promise<string[]> => {
  const locations = (await axios.get(`${apiBaseUrl}/locations`)).data;
  return locations;
};

export { getLocations };
