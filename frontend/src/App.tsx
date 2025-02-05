import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import ScanPage from './components/ScanPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import SignInPage from './components/SignInPage';
import AddBooksPage from './components/AddBookPage';

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

  const padding = {
    padding: 5,
  };

  return (
    <BrowserRouter>
      <h1>Library App</h1>
      <div>
        <Link style={padding} to="/">
          Home
        </Link>
        <Link style={padding} to="/scan">
          Scan
        </Link>
        <Link style={padding} to="/profile">
          Profile
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/addBooks" element={<AddBooksPage />} />
        <Route path="/profile" element={<ProfilePage profile={profile} logOut={logOut} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
