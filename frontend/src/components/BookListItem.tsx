interface BookListItemProps {
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
    description: string;
    publish_year: string;
  };
}

const BookListItem = ({ book }: BookListItemProps) => {
  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px', display: 'inline-block' }}>
      <p>Title: {book.title}</p>
      <p>Author: {book.author}</p>
      <p>Year: {book.publish_year}</p>
    </div>
  );
};

export default BookListItem;
