import { Chip } from '@mui/material';
import useMainStore from '../../hooks/useMainStore';
import { FetchedTag } from '../../interfaces/Tags';
import ItemsSlider from '../ItemsSlider/ItemsSlider';

import './FilterWithTags.css';

interface FilterWithTagsProps {
  selectedTags: FetchedTag[];
  setSelectedTags: (val: FetchedTag[]) => void;
}
const FilterWithTags = ({ selectedTags, setSelectedTags }: FilterWithTagsProps) => {
  const tags = useMainStore((state) => state.tags);

  const handleClick = (tag: FetchedTag) => {
    if (!selectedTags.includes(tag)) {
      const newSelectedTags = selectedTags.concat(tag);
      setSelectedTags(newSelectedTags);
    } else {
      const newSelectedTags = selectedTags.filter((selectedTag) => selectedTag.id != tag.id);
      setSelectedTags(newSelectedTags);
    }
  };

  return (
    <div className="tag-slider">
      <ItemsSlider renderButtons={false}>
        {tags.map((tag: FetchedTag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
            onClick={() => handleClick(tag)}
          />
        ))}
      </ItemsSlider>
    </div>
  );
};

export default FilterWithTags;
