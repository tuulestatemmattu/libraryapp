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
}

interface CreatedBook {
  authors: string;
  title: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
}

export type { CreatedBook, FetchedBook };
