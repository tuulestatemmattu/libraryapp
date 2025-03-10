import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonGroup } from '@mui/material';

import useRequireAdmin from '../../hooks/useRequireAdmin';
import TagTable from './tables/TagTable';
import UserTable from './tables/UserTable';

type ViewOpt = 'users' | 'tags';

const AdminPage = () => {
  useRequireAdmin();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const viewParam = queryParams.get('view') as ViewOpt;

  const [view, setView] = useState<ViewOpt>(viewParam || 'users');

  const changeView = (newView: ViewOpt) => {
    setView(newView);
    navigate(`/admin?view=${newView}`, { replace: true });
  };

  useEffect(() => {
    if (viewParam) {
      setView(viewParam);
    }
  }, [viewParam]);

  const Content = () => {
    if (view === 'users') {
      return <UserTable />;
    }
    if (view === 'tags') {
      return <TagTable />;
    }
  };

  return (
    <article>
      <div className="center">
        <ButtonGroup variant="contained" className="button-group">
          <Button className="button" variant="contained" onClick={() => changeView('users')}>
            Users
          </Button>
          <Button className="button" variant="contained" onClick={() => changeView('tags')}>
            Tags
          </Button>
        </ButtonGroup>
      </div>
      <div>
        <Content />
      </div>
    </article>
  );
};

export default AdminPage;
