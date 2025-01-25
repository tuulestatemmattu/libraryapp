import { Link } from 'react-router-dom';
import '../css/NavBar.css';

interface NavBarProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  } | null;
}

const NavBar = ({ profile }: NavBarProps) => {
  return (
    <nav className="nav-bar">
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/scan">Scan</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div>
        <h1>Welcome {profile ? (profile.name) : ('')}! </h1>
      </div>
      <div className="profile-section">
        {profile && (
          <Link to="/profile">
            <img
              src={profile.picture}
              alt={profile.name}
              className="profile-picture"
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
