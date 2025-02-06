export interface ProfileProps {
  profile: {
    name: string;
    email: string;
    picture: string;
  };
  logOut: () => void;
}
