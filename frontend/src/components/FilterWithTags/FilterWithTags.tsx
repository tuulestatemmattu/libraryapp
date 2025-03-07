import { Chip } from '@mui/material';
import useMainStore from '../../hooks/useMainStore';
import { FetchedTag } from '../../interfaces/Tags';
import ItemsSlider from '../ItemsSlider/ItemsSlider';

const FilterWithTags = () => {
  const tags = useMainStore((state) => state.tags);

  return (
    <div className="tag-slider">
      <ItemsSlider>
        {tags.map((tag: FetchedTag) => (
          <Chip key={tag.id} label={tag.name} />
        ))}
      </ItemsSlider>
    </div>
  );
};

export default FilterWithTags;
