import { Typography, Toolbar, Box, AppBar, Select, MenuItem, Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './NavBar.css';
import { officeLocations } from '../../constants';
import { useNavigate } from 'react-router-dom';
import useMainStore from '../../hooks/useMainStore';
import ProfilePicture from '../ProfilePicture';
import { Stack } from '@mui/material';

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
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box className="leftside-items" sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                component="div"
                className="typemenuicon"
                onClick={() => navigate('/')}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <MenuBookIcon sx={{ mr: 1, color: '#101820' }} />
              </Typography>
              {profile?.admin && (
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
                  sx={{ letterSpacing: '3px', fontWeight: 600 }}
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
  );
};

export default NavBar;
