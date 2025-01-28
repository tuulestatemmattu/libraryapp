import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

interface ProfilePageProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  };
  logOut: () => void;
}

const ProfilePage = ({ profile, logOut }: ProfilePageProps) => {
  const navigate = useNavigate();

  const doLogOut = () => {
    logOut();
    navigate('/');
  };

  return (
    <div>
      <Profile profile={profile} />
      <button onClick={doLogOut}>Log out</button>
    </div>
  );
};

export default ProfilePage;
