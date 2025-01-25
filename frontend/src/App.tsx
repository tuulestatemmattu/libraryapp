import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import NavBar from './components/NavBar';
import ScanPage from './components/ScanPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import SignInPage from './components/SignInPage';
import { apiBaseUrl } from './constants';
import { usePingTest } from './hooks/usePingTest';
import './css/App.css'

const App = () => {
  const pingResult = usePingTest(apiBaseUrl + '/ping');
  console.log(pingResult)
  const { profile, login, logOut } = useGoogleAuth();

  if (!profile) {
    return (
      <div className='main-content'>
        <main>
          <SignInPage login={login} />
        </main>
      </div>
    );
  }

  return (
    <BrowserRouter>
    <div className='main-content'>
      <header>
        <NavBar profile={profile} />
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/profile" element={<ProfilePage profile={profile} logOut={logOut}/>} />
        </Routes>
      </main>
    </div>
    </BrowserRouter>
  );
};

export default App;
