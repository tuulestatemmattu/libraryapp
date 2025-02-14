import { useState, ReactElement } from 'react';
import React from 'react';
import './ItemsSlider.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Container } from 'react-bootstrap';

interface Props {
  title: string;
  children: ReactElement[];
}

const ItemsSlider = ({ title, children }: Props) => {
  const scrl = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [scrollX, setscrollX] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);

  const slide = (shift: number) => {
    const currentScrl = scrl.current;
    if (!currentScrl) return;

    currentScrl.scrollBy({
      left: shift,
      behavior: 'smooth',
    });

    currentScrl.scrollLeft += shift;
    setscrollX((prev) => prev + shift);

    if (Math.floor(currentScrl.scrollWidth - currentScrl.scrollLeft) <= currentScrl.offsetWidth) {
      setScrollEnd(true);
    } else {
      setScrollEnd(false);
    }
  };

  const scrollCheck = () => {
    const currentScrl = scrl.current;
    if (!currentScrl) return;

    setscrollX(currentScrl.scrollLeft);
    if (Math.floor(currentScrl.scrollWidth - currentScrl.scrollLeft) <= currentScrl.offsetWidth) {
      setScrollEnd(true);
    } else {
      setScrollEnd(false);
    }
  };

  return (
    <Container fluid className="my-3 py-3 item-slider-container">
      <h4 className="px-3 mb-3 item-title">{title}</h4>
      <div className="item-slider">
        <div
          onClick={() => slide(-100)}
          className={`left-arrow-left ${scrollX < 1 ? 'is-disabled-hide' : ''}`}
        >
          <ArrowBackIosIcon />
        </div>
        <div ref={scrl} onScroll={scrollCheck} className="item-container">
          {children}
        </div>
        <div
          className={`right-arrow-right ${!scrollEnd ? '' : 'is-disabled-hide'}`}
          onClick={() => slide(+100)}
        >
          <ArrowForwardIosIcon />
        </div>
      </div>
    </Container>
  );
};

export default ItemsSlider;
