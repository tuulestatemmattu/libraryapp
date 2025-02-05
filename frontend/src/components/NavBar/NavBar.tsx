import { Typography, Toolbar, Box, AppBar, Avatar, Link } from '@mui/material';
import React from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './NavBar.css';
interface ProfileProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  };
}

const NavBar: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <Box className="navbarbox">
      <AppBar className="appbar">
        <Toolbar>
          <Typography variant="h6" component="div" className="typmenuicon">
            <Link href="/" color="inherit" underline="none">
              <MenuBookIcon className="menuicon" />
            </Link>
          </Typography>
          <Link href="/profile">
            <Avatar src={profile.picture} />
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default NavBar;
