import { ReactElement, useRef } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './ItemsSlider.css';

interface Props {
  title: string;
  children: ReactElement[];
}

const ItemsSlider = ({ title, children }: Props) => {
  const scrollref = useRef<HTMLDivElement | null>(null);
  const scrollAmount = 400;
  return (
    <div style={{ overflow: 'hidden' }}>
      <h2>{title}</h2>
      <div style={{ position: 'relative', backgroundColor: 'red' }}>
        <div
          style={{
            justifyContent: 'space-between',
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            zIndex: 1,
          }}
        >
          <div
            style={{ margin: 'auto 0' }}
            onClick={() => {
              if (scrollref.current) scrollref.current.scrollLeft -= scrollAmount;
            }}
          >
            <KeyboardArrowLeftIcon
              fontSize="large"
              style={{
                margin: 'auto 0',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderRadius: '1000px',
                padding: '3px',
                zIndex: 1,
              }}
            />
          </div>
          <div
            style={{ margin: 'auto 0' }}
            onClick={() => {
              if (scrollref.current) scrollref.current.scrollLeft += scrollAmount;
            }}
          >
            <KeyboardArrowRightIcon
              fontSize="large"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '1000px',
                padding: '3px',
              }}
            />
          </div>
        </div>
        <div
          ref={scrollref}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
          }}
        >
          {children.map((child) => (
            <div style={{ padding: 20 }}>{child}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsSlider;
