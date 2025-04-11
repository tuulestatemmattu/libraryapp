import { useState } from 'react';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box>
      {isExpanded || content.length <= charLimit ? content : content.slice(0, charLimit) + '...'}
      {'   '}
      {content.length > charLimit && (
        <Box
          component="span"
          onClick={toggleExpand}
          sx={{
            cursor: 'pointer',
            color: theme.palette.expandableCollapsable.main,
            whiteSpace: 'nowrap',
          }}
        >
          {isExpanded ? readLessText : readMoreText}
        </Box>
      )}
    </Box>
  );
};
