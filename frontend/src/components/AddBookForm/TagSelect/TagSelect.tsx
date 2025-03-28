import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';

import { FetchedTag } from '../../../interfaces/Tags';

interface TagSelectProps {
  tags: FetchedTag[];
  selectedTags: FetchedTag[];
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

const getStyles = (tag: string, selectedTagNames: readonly string[], theme: Theme) => {
  return {
    fontWeight: selectedTagNames.includes(tag)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
};

const TagSelect = ({ tags, selectedTags, onSelectTag }: TagSelectProps) => {
  const tagNames = tags.map((tag) => tag.name);
  const selectedTagNames = selectedTags.map((tag) => tag.name);

  const theme = useTheme();
  return (
    <FormControl sx={{ my: 1.5, maxWidth: '100%', width: '100%' }}>
      <InputLabel>Tags</InputLabel>
      <Select
        labelId="tags-label"
        id="tag-select"
        multiple
        value={selectedTagNames}
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
        {tagNames.map((tag) => (
          <MenuItem key={tag} value={tag} style={getStyles(tag, selectedTagNames, theme)}>
            {tag}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagSelect;
