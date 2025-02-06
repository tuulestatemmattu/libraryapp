import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGoogleAuth } from './hooks/useGoogleAuth';

import ScanPage from './components/ScanPage';
import HomePage from './components/HomePage';
import SignInPage from './components/SingInPage/SignInPage';
import AddBooksPage from './components/AddBookPage';
import NavBar from './components/NavBar/NavBar';
import FloatingButton from './components/FloatingButton/FloatingButton';

import './style.css';

const App = () => {
  const { profile, login, logOut } = useGoogleAuth();

  if (!profile) {
    return <SignInPage login={login} />;
  }

  return (
    <BrowserRouter>
      <NavBar profile={profile} logOut={logOut} />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/addBooks" element={<AddBooksPage />} />
        </Routes>
      </div>

      <FloatingButton />
    </BrowserRouter>
  );
};

export default App;
