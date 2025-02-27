import { SyntheticEvent, useState } from 'react';
import useMainStore from '../../hooks/useMainStore';
import { addTag } from '../../services/tag';
import StyledInput from '../StyledInput/StyledInput';
import { Button } from '@mui/material';

const AddTag = () => {
  const tags = useMainStore((state) => state.tags);
  const addTagtoStore = useMainStore((state) => state.addTag);

  const [tag, setTag] = useState('');

  const createTag = async (event: SyntheticEvent) => {
    event.preventDefault();
    const newTagObject = { name: tag };
    const tagNames = tags.map((tag) => tag.name);

    if (!tagNames.includes(tag)) {
      const createdTag = await addTag(newTagObject);
      addTagtoStore(createdTag);
      setTag('');
    } else {
      console.log('tag already exists');
    }
  };

  return (
    <div>
      <form onSubmit={createTag}>
        <StyledInput label="Add new tag" value={tag} setValue={setTag} />
        <div>
          <Button type="submit">submit</Button>
        </div>
      </form>
    </div>
  );
};

export default AddTag;
