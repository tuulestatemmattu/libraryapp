export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';
let officeLocationsTemp: string[];
if (!import.meta.env.PRODUCTION) {
  officeLocationsTemp = [
    'Helsinki',
    'Tampere',
    'Copenhagen',
    'Aarhus',
    'Munich',
    'Berlin',
    'Oslo',
    'Łódź',
    'Malmö',
    'Stockholm',
    'Gothenburg',
    'Amsterdam',
    'Zurich',
    'London',
    'Southampton',
    'Philadelphia',
    'testing',
  ];
} else {
  officeLocationsTemp = [
    'Helsinki',
    'Tampere',
    'Copenhagen',
    'Aarhus',
    'Munich',
    'Berlin',
    'Oslo',
    'Łódź',
    'Malmö',
    'Stockholm',
    'Gothenburg',
    'Amsterdam',
    'Zurich',
    'London',
    'Southampton',
    'Philadelphia',
  ];
}

export const officeLocations = officeLocationsTemp;
