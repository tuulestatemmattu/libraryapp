import { ReactElement, useRef } from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Stack } from '@mui/material';

import './ItemsSlider.css';

interface Props {
  children: ReactElement[];
  renderButtons: boolean;
}

const ItemsSlider = ({ renderButtons, children }: Props) => {
  const scrollref = useRef<HTMLDivElement | null>(null);
  const scrollAmount = 400;

  if (children.length === 0) {
    return null;
  }

  return (
    <Stack style={{ width: '100%' }}>
      <div className="scroll-item-container">
        {renderButtons && (
          <div>
            <div
              className="scroll-button-container left"
              onClick={() => {
                if (scrollref.current) scrollref.current.scrollLeft -= scrollAmount;
              }}
            >
              <KeyboardArrowLeftIcon fontSize="large" className="scroll-button" />
            </div>
            <div
              className="scroll-button-container right"
              onClick={() => {
                if (scrollref.current) scrollref.current.scrollLeft += scrollAmount;
              }}
            >
              <KeyboardArrowRightIcon fontSize="large" className="scroll-button" />
            </div>
          </div>
        )}
        <div ref={scrollref} className="scroll-list-container">
          {children.map((child) => (
            <div className="scroll-list-item-container" key={child.key}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </Stack>
  );
};

export default ItemsSlider;
