import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { officeLocations } from '../../constants';

import './LocationSelect.css';

interface LocationSelectProps {
  value: string;
  onChangeLocation: (arg0: string) => void;
}

const LocationSelect = ({ value, onChangeLocation }: LocationSelectProps) => {
  return (
    <TextField
      select
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
