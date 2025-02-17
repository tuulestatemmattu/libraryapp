import { Typography, Toolbar, Box, AppBar, Link, Select, MenuItem } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Profile from '../Profile';
import './NavBar.css';
import { officeLocations } from '../../constants';
import { LocationContext } from '../../context/LocationProvider/LocationProvider';
import { useContext } from 'react';

interface navBarProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  };
  logOut: () => void;
  children: React.ReactNode;
}

const NavBar: React.FC<navBarProps> = ({ profile, logOut, children }) => {
  const [location, setLocation] = useContext(LocationContext);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 150,
      },
    },
  };

  return (
    <div>
      <Box>
        <AppBar>
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" className="typmenuicon">
              <Link href="/" color="inherit" underline="none">
                <MenuBookIcon className="menuicon" />
              </Link>
            </Typography>
            <Select
              className="loction-box"
              value={location}
              onChange={({ target }) => setLocation(target.value)}
              sx={{
                overflowY: 'visible',
                maxHeight: '100px',
                letterSpacing: '3px',
                fontWeight: '666',
                fontSize: '20px',
                border: 'none',
              }}
              MenuProps={MenuProps}
            >
              {officeLocations.map((officeLocation) => (
                <MenuItem
                  key={officeLocation}
                  value={officeLocation}
                  style={{ letterSpacing: '3px', fontWeight: '666' }}
                >
                  {officeLocation}
                </MenuItem>
              ))}
            </Select>
            <Profile profile={profile} logOut={logOut} />
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </div>
  );
};

export default NavBar;
