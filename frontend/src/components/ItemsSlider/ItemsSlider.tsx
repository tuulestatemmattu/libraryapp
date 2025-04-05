import { ReactElement, useRef } from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import './ItemsSlider.css';

interface ItemsSliderProps {
  children: ReactElement[];
  renderButtons: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

const ItemsSlider = ({
  renderButtons,
  children,
  backgroundColor,
  borderColor,
}: ItemsSliderProps) => {
  const scrollref = useRef<HTMLDivElement | null>(null);
  const scrollAmount = 400;
  const theme = useTheme();

  if (children.length === 0) {
    return null;
  }

  return (
    <Stack style={{ width: '100%' }}>
      <div
        className="scroll-item-container"
        style={{
          backgroundColor: backgroundColor || theme.palette.componentBack.main,
        }}
      >
        {renderButtons && (
          <div>
            <div
              className="scroll-button-container left"
              onClick={() => {
                if (scrollref.current) scrollref.current.scrollLeft -= scrollAmount;
              }}
            >
              <KeyboardArrowLeftIcon
                fontSize="large"
                style={{
                  backgroundColor: backgroundColor || theme.palette.componentBack.light,
                  margin: 'auto',
                  padding: '3px',
                  borderRadius: '1000px',
                  border: '1px solid',
                  borderColor: borderColor || theme.palette.componentBack.dark,
                }}
                className="scroll-button"
              />
            </div>
            <div
              className="scroll-button-container right"
              onClick={() => {
                if (scrollref.current) scrollref.current.scrollLeft += scrollAmount;
              }}
            >
              <KeyboardArrowRightIcon
                fontSize="large"
                className="scroll-button"
                style={{
                  backgroundColor: backgroundColor || theme.palette.componentBack.light,
                  margin: 'auto',
                  padding: '3px',
                  borderRadius: '1000px',
                  border: '1px solid',
                  borderColor: borderColor || theme.palette.componentBack.dark,
                }}
              />
            </div>
          </div>
        )}
        <div ref={scrollref} className="scroll-list-container">
          {children.map((child) =>
            child.props.book && child.props.book.status === 'late' ? (
              <div className="scroll-list-item-container-late-book" key={child.key}>
                {child}
              </div>
            ) : (
              <div className="scroll-list-item-container" key={child.key}>
                {child}
              </div>
            ),
          )}
        </div>
      </div>
    </Stack>
  );
};

export default ItemsSlider;
