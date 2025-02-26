import { Avatar, Button, ButtonGroup } from '@mui/material';
import './ProfileCard.css';
import Profile from '../../interfaces/Profile';

interface ProfileCardProps {
  profile: Profile;
  logOut: () => void;
}

const ProfileCard = ({ profile, logOut }: ProfileCardProps) => {
  return (
    <div className="profilecard">
      <div className="profile-info-box">
        <h1 className="profile-card-header">profile</h1>
        <Avatar src={profile.picture} className="avatar-picture" />
        <div className="profile-info">
          <h2 className="profile-card-name">{profile.name}</h2>
          <h3 className="profile-card-email">{profile.email}</h3>
          {profile.admin && <h3 className="profile-card-email">Admin</h3>}
        </div>
      </div>
      <ButtonGroup className="profile-card-buttons">
        <Button variant="text" color="inherit" onClick={logOut}>
          Logout
        </Button>
      </ButtonGroup>
    </div>
  );
};
export default ProfileCard;
