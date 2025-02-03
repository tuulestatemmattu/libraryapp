import { Typography, Toolbar, Box, AppBar, Avatar, Link } from '@mui/material';
import React from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface ProfileProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  };
}

const NavBar: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <Box sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" color="inherit" underline="none">
              <MenuBookIcon sx={{ width: 'auto', height: '40px' }} />
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
