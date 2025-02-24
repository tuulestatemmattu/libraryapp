import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGoogleAuth } from './hooks/useGoogleAuth';

import ScanPage from './components/ScanPage/ScanPage';
import HomePage from './components/HomePage';
import SignInPage from './components/SingInPage/SignInPage';
import AddBooksPage from './components/AddBookPage/AddBookPage';
import NavBar from './components/NavBar/NavBar';
import FloatingButton from './components/FloatingButton/FloatingButton';
import { NotificationProvider } from './context/NotificationsProvider/NotificationProvider';
import { LocationProvider } from './context/LocationProvider/LocationProvider';

import './style.css';
import { FetchedBook } from './interfaces/Book';
import { useEffect, useState } from 'react';
import { getBooks } from './services/book';

const App = () => {
  const { profile, login, logOut } = useGoogleAuth();
  const [books, setBooks] = useState<FetchedBook[]>([]);

  useEffect(() => {
    getBooks().then((result) => setBooks(result));
  }, []);

  if (!profile) {
    return <SignInPage login={login} />;
  }

  return (
    <NotificationProvider>
      <LocationProvider>
        <BrowserRouter>
          <NavBar profile={profile} logOut={logOut} />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<HomePage books={books} />} />
              <Route path="/scan" element={<ScanPage books={books} />} />
              <Route path="/addBook" element={<AddBooksPage />} />
            </Routes>
          </main>
          <FloatingButton type="scan" />
          <FloatingButton type="add" />
        </BrowserRouter>
      </LocationProvider>
    </NotificationProvider>
  );
};

export default App;
