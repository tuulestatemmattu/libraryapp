import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import './FloatingButton.css';

const FloatingButton = () => {
  return (
    <Fab href={'/addBooks'} color="primary" aria-label="like" className="floatingbutton">
      <AddIcon className="floatingicon" />
    </Fab>
  );
};

export default FloatingButton;
