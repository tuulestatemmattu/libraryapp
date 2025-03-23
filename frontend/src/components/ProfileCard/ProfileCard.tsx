import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import Profile from '../../interfaces/Profile';

import './ProfileCard.css';

interface ProfileCardProps {
  profile: Profile;
  logOut: () => void;
}

const ProfileCard = ({ profile, logOut }: ProfileCardProps) => {
  return (
    <div className="profilecard" style={{ backgroundColor: 'rgba(230, 230, 230, 0.9)' }}>
      <div className="profile-info-box">
        <h1 className="profile-card-header" style={{ color: 'rgb(128, 128, 128)' }}>
          profile
        </h1>
        <Avatar src={profile.picture} className="avatar-picture" />
        <div className="profile-info">
          <h2 className="profile-card-name">{profile.name}</h2>
          <h3 className="profile-card-email" style={{ color: 'rgb(128, 128, 128)' }}>
            {profile.email}
          </h3>
          {profile.admin && (
            <h3 className="profile-card-email" style={{ color: 'rgb(128, 128, 128)' }}>
              Admin
            </h3>
          )}
        </div>
      </div>
      <ButtonGroup className="profile-card-buttons">
        <Button variant="text" color="inherit" onClick={logOut} className="logout-button">
          Logout
        </Button>
      </ButtonGroup>
    </div>
  );
};
export default ProfileCard;
