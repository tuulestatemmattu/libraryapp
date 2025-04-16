import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

import useMainStore from '../../hooks/useMainStore';
import { FetchedTag } from '../../interfaces/Tags';
import ItemsSlider from '../ItemsSlider/ItemsSlider';

interface FilterWithTagsProps {
  selectedTags: FetchedTag[];
  setSelectedTags: (selectedTags: FetchedTag[]) => void;
}

const FilterWithTags = ({ selectedTags, setSelectedTags }: FilterWithTagsProps) => {
  const tags = useMainStore((state) => state.tags);
  const theme = useTheme();

  const handleClick = (tag: FetchedTag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag.id !== tag.id));
    }
  };

  return (
    <div className="tag-slider">
      <ItemsSlider renderButtons={false} backgroundColor={theme.palette.background.default}>
        {tags.map((tag: FetchedTag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
            onClick={() => handleClick(tag)}
            sx={{
              backgroundColor: selectedTags.includes(tag)
                ? theme.palette.primary.main
                : 'transparent',
              color: selectedTags.includes(tag)
                ? theme.palette.secondary.main
                : theme.palette.text.primary,
              borderColor: theme.palette.componentBack.main,
              '&:hover': {
                backgroundColor: selectedTags.includes(tag)
                  ? theme.palette.hoverTag.main
                  : undefined,
              },
            }}
          />
        ))}
      </ItemsSlider>
    </div>
  );
};

export default FilterWithTags;
