import { useEffect, useState } from 'react';

import {
  Box,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme,
} from '@mui/material';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';

import useMainStore from '../../../hooks/useMainStore';
import { FetchedTag } from '../../../interfaces/Tags';

const getStyles = (name: string, selectedTags: FetchedTag[], theme: Theme) => {
  return {
    fontWeight: selectedTags.map((tag) => tag.name).includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
};

type SelectTagsProps = GridRenderEditCellParams<FetchedTag[]>;

const SelectTags = ({ id, value, field }: SelectTagsProps) => {
  const [selectedTags, setSelectedtags] = useState<FetchedTag[]>([]);
  const tags = useMainStore((state) => state.tags);
  const apiRef = useGridApiContext();
  const theme = useTheme();

  useEffect(() => {
    setSelectedtags(tags.filter((tag) => value.map((v: FetchedTag) => v.name).includes(tag.name)));
  }, []);

  const handleChange = (event: SelectChangeEvent<FetchedTag[]>) => {
    const newTags = event.target.value as FetchedTag[];
    setSelectedtags(newTags);
    apiRef.current.setEditCellValue({ id, field, value: newTags });
  };

  return (
    <Select
      sx={{ minwidth: 200 }}
      multiple
      value={selectedTags}
      onChange={handleChange}
      input={<OutlinedInput />}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, minwidth: 250 }}>
          {selected.map((tag: FetchedTag) => (
            <Chip key={tag.id} label={tag.name} size="small" />
          ))}
        </Box>
      )}
    >
      {tags.map((tag) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <MenuItem key={tag.id} value={tag as any} style={getStyles(tag.name, selectedTags, theme)}>
          {tag.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectTags;
