interface BookListItemProps {
  book: {
    id: number;
    title: string;
    authors: string;
    isbn: string;
    description: string;
    publishedDate: string;
  };
}

const BookListItem = ({ book }: BookListItemProps) => {
  return (
    <div
      style={{
        border: '1px solid black',
        padding: '10px',
        margin: '10px',
        display: 'inline-block',
      }}
    >
      <p>Title: {book.title}</p>
      <p>Author: {book.authors}</p>
      <p>Year: {book.publishedDate}</p>
    </div>
  );
};

export default BookListItem;
