import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGoogleAuth } from './hooks/useGoogleAuth';

import ScanPage from './components/ScanPage';
import HomePage from './components/HomePage';
import SignInPage from './components/SingInPage/SignInPage';
import AddBooksPage from './components/AddBookPage/AddBookPage';
import NavBar from './components/NavBar/NavBar';
import FloatingButton from './components/FloatingButton/FloatingButton';
import { NotificationProvider } from './context/NotificationsProvider/NotificationProvider';

import './style.css';
import { useEffect } from 'react';
import { getBooks } from './services/book';
import useMainStore from './hooks/useMainStore';

const App = () => {
  const { profile, login, logOut } = useGoogleAuth();
  const setBooks = useMainStore((state) => state.setBooks);

  useEffect(() => {
    getBooks().then((result) => setBooks(result));
  }, []);

  if (!profile) {
    return <SignInPage login={login} />;
  }

  return (
    <NotificationProvider>
      <BrowserRouter>
        <NavBar profile={profile} logOut={logOut} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/addBook" element={<AddBooksPage />} />
          </Routes>
        </main>
        <FloatingButton type="scan" />
        <FloatingButton type="add" />
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;
