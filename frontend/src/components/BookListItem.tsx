import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';


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
      <Card
        variant="outlined"
        sx={{
          width: { xs: 150, sm: 200, md: 250 }, // xs for phones, sm for tablets, md for desktop
          height: { xs: 250, sm: 350, md: 415 },
        }}
      >
        <CardActionArea sx={{ height: "100%" }}>
        <CardMedia
          component="img"
          src="https://m.media-amazon.com/images/I/91VvijsCGIL._AC_UF894,1000_QL80_.jpg"
          alt="image"
        />
          <CardContent 
          sx={{
            textAlign: "left",
            padding: { xs: 1, md: 2 },
          }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {book.title}
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              component="div"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {book.authors}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
  );
};

export default BookListItem;
