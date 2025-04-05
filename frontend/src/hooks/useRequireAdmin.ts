import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useMainStore from './useMainStore';

const useRequireAdmin = () => {
  const navigate = useNavigate();
  const profile = useMainStore((state) => state.profile);

  useEffect(() => {
    if (!profile?.admin) {
      navigate('/');
    }
  }, [profile]);
};

export default useRequireAdmin;
