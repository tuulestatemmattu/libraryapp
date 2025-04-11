import { useState } from 'react';

import { Box } from '@mui/material';

interface ExpandableCollapsableProps {
  content: string;
  charLimit: number;
  readMoreText: string;
  readLessText: string;
}

export const ExpandableCollapsable = ({
  content,
  charLimit,
  readMoreText,
  readLessText,
}: ExpandableCollapsableProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box>
      {isExpanded || content.length <= charLimit ? content : content.slice(0, charLimit) + '...'}{' '}
      <Box
        component="span"
        onClick={toggleExpand}
        sx={{ cursor: 'pointer', color: 'primary.main', whiteSpace: 'nowrap' }}
      >
        {isExpanded ? readLessText : readMoreText}
      </Box>
    </Box>
  );
};
