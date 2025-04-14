import { useEffect, useState } from 'react';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { getLocations } from '../../../services/locations.ts';

import './LocationSelect.css';

interface LocationSelectProps {
  value: string;
  onChangeLocation: (arg0: string) => void;
}

const LocationSelect = ({ value, onChangeLocation }: LocationSelectProps) => {
  const [officeLocations, setOfficeLocations] = useState(['Helsinki']);

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getLocations();
      setOfficeLocations(locations);
    };
    fetchLocations();
  }, []);

  return (
    <TextField
      select
      fullWidth
      value={value}
      onChange={(event) => onChangeLocation(event.target.value)}
      label="Office"
      className="location-select"
      slotProps={{
        input: { id: 'location-select' },
        inputLabel: { htmlFor: 'location-select' },
      }}
    >
      {officeLocations.map((officeLocation) => (
        <MenuItem key={officeLocation} value={officeLocation}>
          {officeLocation}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default LocationSelect;
