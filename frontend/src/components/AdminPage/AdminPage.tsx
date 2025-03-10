import BookTable from './tables/BookTable';
import UserTable from './tables/UserTable';

const AdminPage = () => {
  return (
    <div>
      <UserTable />
      <BookTable />
    </div>
  );
};

export default AdminPage;
