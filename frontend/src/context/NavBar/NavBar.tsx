import { Typography, Toolbar, Box, AppBar, Link, TextField } from '@mui/material';
import React from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Profile from '../../components/Profile';
import './NavBar.css';

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
  return (
    <div>
      <Box>
        <AppBar>
          <Toolbar style={{ backgroundColor: 'red' }}>
            <Box>
              <Typography variant="h6" component="div" className="typmenuicon">
                <Link href="/" color="inherit" underline="none">
                  <MenuBookIcon className="menuicon" />
                </Link>
              </Typography>
            </Box>
            <Box>
              <TextField className="loction-box"></TextField>
            </Box>
            <Box>
              <Profile profile={profile} logOut={logOut} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </div>
  );
};

export default NavBar;
