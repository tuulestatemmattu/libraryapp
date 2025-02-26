import { useNavigate } from 'react-router-dom';
import useMainStore from './useMainStore';
import { useEffect } from 'react';

const useRequireAdmin = () => {
  const navigate = useNavigate();
  const profile = useMainStore((state) => state.profile);

  useEffect(() => {
    if (!profile || !profile.admin) {
      navigate('/');
    }
  }, [profile]);
};

export default useRequireAdmin;
