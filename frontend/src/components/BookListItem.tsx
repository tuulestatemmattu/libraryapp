interface BookListItemProps {
    book: {
        id: number;
        title: string;
        author: string;
        isbn: string;
        description: string;
        publish_year: string;        
    }
}

const BookListItem = ({book}: BookListItemProps) => {
    return (
        <div>
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
        </div>
    )
}

export default BookListItem;