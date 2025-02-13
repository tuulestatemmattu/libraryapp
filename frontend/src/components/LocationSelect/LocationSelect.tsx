import { TextField, MenuItem } from '@mui/material';
import './LocationSelect.css';

interface InputProps {
  value: string;
  onChangeLocation: (arg0: string) => void;
}

const officeLocations: string[] = [
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

const LocationSelect = ({ value, onChangeLocation }: InputProps) => {
  return (
    <TextField
      select
      value={value}
      onChange={(event) => onChangeLocation(event.target.value)}
      label="Office"
      className="location-select"
      style={{ marginTop: '20px' }}
      slotProps={{
        input: { id: "location-select" },
        inputLabel: { htmlFor: "location-select" },
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
