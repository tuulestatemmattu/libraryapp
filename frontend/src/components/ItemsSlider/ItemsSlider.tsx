import { ReactElement } from 'react';
import './ItemsSlider.css';

interface Props {
  title: string;
  children: ReactElement[];
}

const ItemsSlider = ({ title, children }: Props) => {
  return (
    <div style={{ overflow: 'hidden' }}>
      <div>
        <h2>{title}</h2>
        <div style={{ display: 'flex', flexDirection: 'row', overflow: 'auto' }}>
          {children.map((child) => (
            <div style={{ padding: 20 }}>{child}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsSlider;
