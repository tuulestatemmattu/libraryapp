import BookForm from './BookForm';

const ScanPage = () => {
  return (
    <div>
      <h2>Scan Page</h2>
      <p>This is the scan page</p>
      <BookForm onSubmit={console.log} />
    </div>
  );
};

export default ScanPage;
