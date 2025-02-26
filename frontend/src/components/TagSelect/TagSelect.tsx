import { TextField, MenuItem } from '@mui/material';
import './TagSelect.css';

interface TagSelectProps {
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
}

const tags = [
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

const TagSelect = ({ selectedTags, onSelectTag }: TagSelectProps) => {
  return (
    <div>
      <TextField
        select
        value=""
        onChange={(event) => onSelectTag(event.target.value)}
        label="select tags"
        className="tag-select"
        style={{ marginTop: '20px' }}
        slotProps={{
          input: { id: 'tag-select' },
          inputLabel: { htmlFor: 'tag-select' },
        }}
      >
        {tags.map((tag) => (
          <MenuItem key={tag} value={tag}>
            {tag}
          </MenuItem>
        ))}
      </TextField>
      <div>
        {selectedTags.map((tag) => (
          <p key={tag}>{tag}</p>
        ))}
      </div>
    </div>
  );
};

export default TagSelect;
