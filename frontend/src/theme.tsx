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
        '& .page-content': {
          marginTop: '60px', // Margin for navbar
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '98%',
          maxWidth: '1200px',
        },
        '.icon': {
          marginRight: '10px',
        },
        '.button-group': {
          marginTop: '20px',
        },
        '.button': {
          display: 'flex',
          justifyContent: 'center',
        },
        '.center': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        '.book-content': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        '.book-content.scan': {
          maxWidth: '100%',
          width: 'auto',
          height: 'auto',
          overflow: 'hidden',
        },
        '.book-content.scan video': {
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          objectFit: 'contain',
        },
        '.book-card-placeholder': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: '400px',
          height: '40vw',
          padding: '0 2%',
          borderRadius: '8px',
          backgroundColor: '#ebe8e4',
          position: 'relative',
          margin: '2px',
        },
        '.book-card-placeholder .icon': {
          fontSize: '112px',
          color: 'rgba(0, 0, 0, 0.1)',
        },
        '.book-card-placeholder .text': {
          marginTop: '1%',
          fontSize: '16px',
          color: '#555',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        '@media (max-width: 500px)': {
          '.book-card-placeholder .icon': {
            fontSize: '22.4vw',
          },
          '.book-card-placeholder .text': {
            fontSize: '3.2vw',
          },
        },
      },
    },
  },
});

export default theme;
