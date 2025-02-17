import { ReactElement, useRef } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './ItemsSlider.css';

interface Props {
  title: string;
  children: ReactElement[];
}

const ItemsSlider = ({ children }: Props) => {
  const scrollref = useRef<HTMLDivElement | null>(null);
  const scrollAmount = 400;
  return (
    <div>
      <div className="scroll-item-container">
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
        <div ref={scrollref} className="scroll-list-container">
          {children.map((child) => (
            <div className="scroll-list-item-container">{child}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsSlider;
