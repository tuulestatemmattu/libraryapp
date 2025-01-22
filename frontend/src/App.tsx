import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import ScanPage from './components/ScanPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import SignInPage from './components/SignInPage';
import { apiBaseUrl } from './constants';
import { usePingTest } from './hooks/usePingTest';

const App = () => {
  const pingResult = usePingTest(apiBaseUrl + '/ping');
  const { profile, login, logOut } = useGoogleAuth();
  if (!profile) {
    return (
      <div>
        <p>Ping result: {pingResult}</p>
        <h1>Library App</h1>
        <SignInPage login={login} />
      </div>
    );
  }

  const padding = {
    padding: 5
  }

  return (
    <BrowserRouter>
      <h1>Library App</h1>
      <div>
        <Link style={padding} to="/">Home</Link>
        <Link style={padding} to="/scan">Scan</Link>
        <Link style={padding} to="/profile">Profile</Link>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/profile" element={<ProfilePage profile={profile} logOut={logOut}/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
