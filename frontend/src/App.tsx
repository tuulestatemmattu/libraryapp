import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuthCheck } from './hooks/useAuthCheck';

import ScanPage from './components/ScanPage/ScanPage';
import HomePage from './components/HomePage';
import SignInPage from './components/SingInPage/SignInPage';
import AddBooksPage from './components/AddBookPage/AddBookPage';
import NavBar from './components/NavBar/NavBar';
import FloatingButton from './components/FloatingButton/FloatingButton';
import { NotificationProvider } from './context/NotificationsProvider/NotificationProvider';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import './style.css';
import { useEffect } from 'react';
import { getBooks } from './services/book';
import useMainStore from './hooks/useMainStore';
import AdminPage from './components/AdminPage';

const App = () => {
  useAuthCheck();
  const profile = useMainStore((state) => state.profile);
  const setBooks = useMainStore((state) => state.setBooks);

  useEffect(() => {
    getBooks().then((result) => setBooks(result));
  }, []);

  if (!profile) {
    return <SignInPage />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <BrowserRouter>
          <NavBar />
          <main
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '98%',
              maxWidth: '1200px',
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/addBook" element={<AddBooksPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <FloatingButton type="scan" />
          {profile.admin && <FloatingButton type="add" />}
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
