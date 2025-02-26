import { Typography, Toolbar, Box, AppBar, Select, MenuItem } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Profile from '../Profile';
import './NavBar.css';
import { officeLocations } from '../../constants';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useMainStore from '../../hooks/useMainStore';

interface navBarProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  };
  logOut: () => void;
  children?: React.ReactNode;
}

const NavBar: React.FC<navBarProps> = ({ profile, logOut, children }) => {
  const navigate = useNavigate();
  const location = useMainStore((state) => state.location);
  const setLocation = useMainStore((state) => state.setLocation);

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
        <AppBar style={{ backgroundColor: '#FFC107' }}>
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              component="div"
              className="typmenuicon"
              onClick={() => navigate('/')}
            >
              <MenuBookIcon className="typemenuicon" />
            </Typography>
            <Select
              className="location-box"
              value={location}
              onChange={({ target }) => setLocation(target.value)}
              sx={{
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
                '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
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
