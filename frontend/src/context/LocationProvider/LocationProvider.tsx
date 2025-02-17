import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

export const LocationContext = createContext<[string, Dispatch<SetStateAction<string>>]>([
  'Helsinki', // Default location value
  () => {}, // Placeholder function (no-op) for setLocation
]);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState('Helsinki');
  return (
    <LocationContext.Provider value={[location, setLocation]}> {children}</LocationContext.Provider>
  );
};
