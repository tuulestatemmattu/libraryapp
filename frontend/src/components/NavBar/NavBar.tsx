import { useNavigate } from 'react-router-dom';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { officeLocations } from '../../constants';
import useMainStore from '../../hooks/useMainStore';
import ProfilePicture from '../ProfilePicture';

import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useMainStore((state) => state.location);
  const setLocation = useMainStore((state) => state.setLocation);
  const profile = useMainStore((state) => state.profile);

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

  const handleAdminClick = () => {
    navigate('/admin');
  };

  if (!profile) {
    return null;
  }

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Box>
          <AppBar>
            <Toolbar style={{ justifyContent: 'space-between' }}>
              <Box className="leftside-items">
                <Typography
                  variant="h6"
                  component="div"
                  className="typmenuicon"
                  onClick={() => navigate('/')}
                >
                  <MenuBookIcon className="typemenuicon" />
                </Typography>
                {profile.admin && (
                  <Button color="inherit" onClick={handleAdminClick} className="admin-button">
                    Admin Panel
                  </Button>
                )}
              </Box>
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
              <ProfilePicture />
            </Toolbar>
          </AppBar>
        </Box>
      </Stack>
    </div>
  );
};

export default NavBar;
