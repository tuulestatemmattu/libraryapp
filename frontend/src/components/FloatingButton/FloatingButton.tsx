import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { LocalSee } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './FloatingButton.css';

interface FloatingButtonProps {
  type: 'scan' | 'add';
}

const FloatingButton = ({ type }: FloatingButtonProps) => {
  const navigate = useNavigate();

  const url = type === 'scan' ? '/scan' : '/addBook?view=scan';
  const marginRight = type === 'scan' ? 70 : 0;
  const icon =
    type === 'scan' ? <LocalSee className="floatingIcon" /> : <AddIcon className="floatingIcon" />;

  const handleClick = () => {
    navigate(url);
  };

  return (
    <Fab
      onClick={handleClick}
      color="primary"
      aria-label="Add book"
      className="floatingbutton"
      style={{ marginRight }}
    >
      {icon}
    </Fab>
  );
};

export default FloatingButton;
