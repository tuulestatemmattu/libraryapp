import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';

import useMainStore from '../../hooks/useMainStore';
import { getLocations } from '../../services/locations';
import ProfilePicture from '../ProfilePicture';

import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useMainStore((state) => state.location);
  const setLocation = useMainStore((state) => state.setLocation);
  const profile = useMainStore((state) => state.profile);

  const [officeLocations, setOfficeLocations] = useState(['Helsinki']);

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getLocations();
      setOfficeLocations(locations);
    };
    fetchLocations();
  }, []);

  const handleAdminClick = () => {
    navigate('/admin');
  };

  if (!profile) {
    return null;
  }

  return (
    <Box>
      <AppBar>
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <Box
            className="navbar-logo-appname-location"
            sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Button
              onClick={() => navigate('/')}
              sx={{ display: 'flex', alignItems: 'center', px: 0, pb: 0 }}
            >
              <MenuBookIcon sx={{ pl: 0, mr: 1, mt: -0.5 }} />
              <Typography sx={{ textTransform: 'none', fontSize: '1.4rem', fontWeight: 'bold' }}>
                LibraryApp
              </Typography>
            </Button>
            <Select
              variant="standard"
              disableUnderline={true}
              value={location}
              onChange={({ target }) => setLocation(target.value)}
              sx={{ mt: -1, fontSize: '0.9rem' }}
            >
              {officeLocations.map((officeLocation) => (
                <MenuItem key={officeLocation} value={officeLocation}>
                  {officeLocation}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box className="navbar-admin-profile" sx={{ display: 'flex', alignItems: 'center' }}>
            {profile.admin && (
              <Button onClick={handleAdminClick} sx={{ fontSize: '0.9rem', textAlign: 'right' }}>
                Admin Panel
              </Button>
            )}
            <ProfilePicture />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
