import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';

const FloatingButton = () => {
  return (
    <Fab
      href={'/scan'}
      color="primary"
      aria-label="like"
      style={{ position: 'fixed', bottom: 10, right: 10, width: '12vw', height: '12vw' }}
    >
      <SearchIcon style={{ width: '9vw', height: '9vw' }} />
    </Fab>
  );
};

export default FloatingButton;
