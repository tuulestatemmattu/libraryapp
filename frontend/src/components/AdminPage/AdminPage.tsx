import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonGroup } from '@mui/material';

import useMainStore from '../../hooks/useMainStore';
import useRequireAdmin from '../../hooks/useRequireAdmin';
import { getBookRequests } from '../../services/request';
import BookTable from './tables/BookTable';
import BorrowTable from './tables/BorrowTable';
import QueueTable from './tables/QueueTable';
import RequestTable from './tables/RequestTable';
import TagTable from './tables/TagTable';
import UserTable from './tables/UserTable';

type ViewOpt = 'users' | 'tags' | 'books' | 'borrows' | 'queues' | 'requests';

const AdminPage = () => {
  useRequireAdmin();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const viewParam = queryParams.get('view') as ViewOpt;
  const setBookRequests = useMainStore((state) => state.setBookRequests);

  const [view, setView] = useState<ViewOpt>(viewParam);

  const changeView = (newView: ViewOpt) => {
    setView(newView);
    navigate(`/admin?view=${newView}`, { replace: true });
  };

  useEffect(() => {
    getBookRequests()
      .then((result) => setBookRequests(result))
      .catch((error: unknown) => {
        console.error('Error fetching book requests:', error);
      });
  }, []);

  useEffect(() => {
    setView(viewParam);
  }, [viewParam]);

  const Content = () => {
    switch (view) {
      case 'users':
        return <UserTable />;
      case 'tags':
        return <TagTable />;
      case 'books':
        return <BookTable />;
      case 'borrows':
        return <BorrowTable />;
      case 'queues':
        return <QueueTable />;
      case 'requests':
        return <RequestTable />;
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
          <Button className="button" variant="contained" onClick={() => changeView('books')}>
            Books
          </Button>
          <Button className="button" variant="contained" onClick={() => changeView('borrows')}>
            Borrows
          </Button>
          <Button className="button" variant="contained" onClick={() => changeView('queues')}>
            Queues
          </Button>
          <Button className="button" variant="contained" onClick={() => changeView('requests')}>
            Book requests
          </Button>
        </ButtonGroup>
      </div>
      <article>
        <Content />
      </article>
    </article>
  );
};

export default AdminPage;
