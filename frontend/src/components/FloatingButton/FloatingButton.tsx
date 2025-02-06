import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import './FloatingButton.css';

const FloatingButton = () => {
  return (
    <Fab href={'/scan'} color="primary" aria-label="like" className="floatingbutton">
      <SearchIcon className="floatingicon" />
    </Fab>
  );
};

export default FloatingButton;
