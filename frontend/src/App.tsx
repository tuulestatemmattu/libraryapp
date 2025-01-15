import { useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from './constants';
import SignIn from './components/signIn';

const App = () => {
  useEffect(() => {
    axios.get(`${apiBaseUrl}/ping`);
  });

  return (
    <div>
      <h1> Library App </h1>
      <SignIn />
    </div>
  );
};

export default App;
