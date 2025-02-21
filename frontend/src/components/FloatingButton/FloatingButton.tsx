import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import './FloatingButton.css';

const FloatingButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/addBooks');
  };

  return (
    <Fab onClick={handleClick} color="primary" aria-label="Add book" className="floatingbutton">
      <AddIcon className="floatingicon" />
    </Fab>
  );
};

export default FloatingButton;
