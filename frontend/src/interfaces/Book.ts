interface FetchedBook {
  id: number;
  authors: string;
  title: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
  borrowedByMe: boolean;
  available: boolean;
  lastBorrowedDate: Date;
  imageLink?: string;
}

interface CreatedBook {
  authors: string;
  title: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
}

export type { CreatedBook, FetchedBook };
