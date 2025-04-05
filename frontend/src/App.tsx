import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';

import AddBooksPage from './components/AddBookPage/AddBookPage';
import AdminPage from './components/AdminPage/AdminPage';
import FloatingButton from './components/FloatingButton/FloatingButton';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar/NavBar';
import ScanPage from './components/ScanPage/ScanPage';
import SignInPage from './components/SingInPage/SignInPage';
import { NotificationProvider } from './context/NotificationsProvider/NotificationProvider';
import { useAuthCheck } from './hooks/useAuthCheck';
import useMainStore from './hooks/useMainStore';
import { getBooks } from './services/book';
import { getTags } from './services/tag';
import theme from './theme';

import './style.css';

const App = () => {
  useAuthCheck();
  const profile = useMainStore((state) => state.profile);
  const setBooks = useMainStore((state) => state.setBooks);
  const setTags = useMainStore((state) => state.setTags);

  useEffect(() => {
    getBooks()
      .then((result) => setBooks(result))
      .catch((error: unknown) => {
        console.error('Error fetching books:', error);
      });
    getTags()
      .then((result) => setTags(result))
      .catch((error: unknown) => {
        console.error('Error fetching tags:', error);
      });
  }, []);

  if (!profile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SignInPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <BrowserRouter>
          <NavBar />
          <main className="page-content">
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
