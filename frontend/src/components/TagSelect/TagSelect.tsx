import {
  MenuItem,
  FormControl,
  Box,
  Chip,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  useTheme,
  Theme,
} from '@mui/material';

interface TagSelectProps {
  selectedTags: string[];
  onSelectTag: (event: SelectChangeEvent<string[]>) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

const getStyles = (tag: string, selectedTags: readonly string[], theme: Theme) => {
  return {
    fontWeight: selectedTags.includes(tag)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
};

const TagSelect = ({ selectedTags, onSelectTag }: TagSelectProps) => {
  const theme = useTheme();
  return (
    <FormControl sx={{ my: 1.5, maxWidth: 300, width: '90%' }}>
      <InputLabel>Tags</InputLabel>
      <Select
        labelId="tags-label"
        id="tag-select"
        multiple
        value={selectedTags}
        onChange={(event) => onSelectTag(event)}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((tag: string) => (
              <Chip key={tag} label={tag} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {tags.map((tag) => (
          <MenuItem key={tag} value={tag} style={getStyles(tag, selectedTags, theme)}>
            {tag}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagSelect;
