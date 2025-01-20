import { useGoogleAuth } from './hooks/useGoogleAuth';
import Profile from './components/Profile';

const App = () => {
  const { profile, login, logOut } = useGoogleAuth();

  return (
    <div>
      <h2>Library App</h2>
      <br />
      <br />
      {profile ? (
        <div>
          <Profile profile={profile} />
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button onClick={() => login()}>Sign in with Google</button>
      )}
    </div>
  );
};

export default App;
