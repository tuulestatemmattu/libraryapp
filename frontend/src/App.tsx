import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGoogleAuth } from './hooks/useGoogleAuth';

import ScanPage from './components/ScanPage';
import HomePage from './components/HomePage';
import SignInPage from './components/SingInPage/SignInPage';
import AddBooksPage from './components/AddBookPage';
import NavBar from './context/NavBar/NavBar';
import FloatingButton from './components/FloatingButton/FloatingButton';
import { NotificationProvider } from './context/NotificationsProvider/NotificationProvider';

import './style.css';

const App = () => {
  const { profile, login, logOut } = useGoogleAuth();

  if (!profile) {
    return <SignInPage login={login} />;
  }

  return (
    <NotificationProvider>
      <NavBar profile={profile} logOut={logOut}>
        <BrowserRouter>
          <div className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/addBooks" element={<AddBooksPage />} />
            </Routes>
          </div>

          <FloatingButton />
        </BrowserRouter>
      </NavBar>
    </NotificationProvider>
  );
};

export default App;
