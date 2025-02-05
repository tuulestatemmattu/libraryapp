import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGoogleAuth } from './hooks/useGoogleAuth';

import ScanPage from './components/ScanPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import SignInPage from './components/SignInPage';
import AddBooksPage from './components/AddBookPage';
import NavBar from './components/NavBar/NavBar';
import FloatingButton from './components/FloatingButton/FloatingButton';

const App = () => {
  const { profile, login, logOut } = useGoogleAuth();

  if (!profile) {
    return (
      <div>
        <h1>Library App</h1>
        <SignInPage login={login} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavBar profile={profile} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/addBooks" element={<AddBooksPage />} />
        <Route path="/profile" element={<ProfilePage profile={profile} logOut={logOut} />} />
      </Routes>

      <FloatingButton />
    </BrowserRouter>
  );
};

export default App;
