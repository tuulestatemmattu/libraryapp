import { Link } from 'react-router-dom';

const ScanPage = () => {
  return (
    <div>
      <h2>Scan Page</h2>
      <p>This is the scan page</p>
      <Link to="/addBooks">AddBooks</Link>
    </div>
  );
};

export default ScanPage;

