import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuthCheck } from './hooks/useAuthCheck';

import ScanPage from './components/ScanPage/ScanPage';
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
import AdminPage from './components/AdminPage/AdminPage';
import { getTags } from './services/tag';

const App = () => {
  useAuthCheck();
  const profile = useMainStore((state) => state.profile);
  const setBooks = useMainStore((state) => state.setBooks);
  const setTags = useMainStore((state) => state.setTags);

  useEffect(() => {
    getBooks().then((result) => setBooks(result));
    getTags().then((result) => setTags(result));
  }, []);

  if (!profile) {
    return <SignInPage />;
  }

  return (
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
  );
};

export default App;
