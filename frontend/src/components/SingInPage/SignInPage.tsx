import { Button, Paper } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import './SignInPage.css';

interface SignInPageProps {
  login: () => void;
}

const SignInPage = ({ login }: SignInPageProps) => {
  return (
    <div className="sign-in-div">
      <Paper elevation={12} className="sign-in-paper">
        <h1 className="sign-in-header">Library App</h1>
      </Paper>
      <Button onClick={() => login()} endIcon={<LoginIcon />} variant="contained">
        Sign in with Google
      </Button>
    </div>
  );
};

export default SignInPage;
