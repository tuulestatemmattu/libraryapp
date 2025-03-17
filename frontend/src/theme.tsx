import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    componentBack: {
      main: string;
      dark?: string;
      light?: string;
    };
  }

  interface PaletteOptions {
    componentBack?: {
      main: string;
      dark?: string;
      light?: string;
    };
  }
}
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffc107', //main yellow
    },
    secondary: {
      main: '#101820', //main black-ish blue
    },
    success: {
      main: 'rgb(156, 255, 128)', //green for success also used in 'available' bookmark
      dark: 'rgb(52, 100, 41)', //darkened green for success also used in 'available' bookmark
      light: 'rgb(186, 255, 175)', //lightened green for success
    },
    error: {
      main: 'rgb(252, 124, 110)', // main red for error also used in 'unavailable' bookmark
      dark: 'rgb(152, 56, 53)', // darkened red for error also used in 'unavailable' bookmark
      light: 'rgb(253, 156, 140)', // lightened red for error
    },
    info: {
      main: 'rgb(173, 216, 230)', // main light blue for info also used in 'mine' bookmark
      dark: 'rgb(81, 104, 117)', // darkened blue for info also used in 'mine' bookmark
      light: 'rgb(209, 232, 242)', // lightened blue for info
    },
    background: {
      default: '#f0f0ec', // same than body
    },
    componentBack: {
      main: '#ebe8e4', //darker background for containers
      dark: 'rgba(0, 0, 0, 0.2)',
      light: 'rgba(255, 255, 255, 0.75)',
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
