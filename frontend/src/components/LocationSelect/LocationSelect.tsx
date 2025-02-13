import { TextField, MenuItem } from '@mui/material';
import { officeLocations } from '../../constants';
import './LocationSelect.css';

interface InputProps {
  value: string;
  onChangeLocation: (arg0: string) => void;
}

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
