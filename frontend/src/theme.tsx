import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffc107', // Primary color
    },
    secondary: {
      main: '#101820',
    },
    success: {
      main: 'rgba(66, 203, 85, 0.76)',
    },
    background: {
      default: '#f0f0ec',
    },
  },
  typography: {
    fontFamily: "'Roboto', serif",
    h2: {
      fontSize: 'medium',
    },
    h3: {
      fontSize: 'small',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffc107 !important',
          color: '#101820 !important',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#101820',
          color: '#ffc107',
          position: 'fixed',
          right: '13px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          fontWeight: 600,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          zIndex: 1301,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          fontFamily: "'Roboto', serif",
        },
        body: {
          backgroundColor: '#f0f0ec',
          marginBottom: '100px',
        },
        article: {
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily: 'inherit',
        },
      },
    },
  },
});

export default theme;
