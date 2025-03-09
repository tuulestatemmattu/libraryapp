import axios from 'axios';

import LoginIcon from '@mui/icons-material/Login';
import { Button, Paper } from '@mui/material';

import { apiBaseUrl } from '../../constants';

import './SignInPage.css';

const SignInPage = () => {
  const redirectToLogin = async () => {
    const url = (await axios.get(`${apiBaseUrl}/login`)).data;
    window.location.href = url;
  };

  return (
    <div className="sign-in-div">
      <Paper elevation={12} className="sign-in-paper">
        <h1 className="sign-in-header">Library App</h1>
      </Paper>
      <Button onClick={() => redirectToLogin()} endIcon={<LoginIcon />} variant="contained">
        Sign in with Google
      </Button>
    </div>
  );
};

export default SignInPage;
