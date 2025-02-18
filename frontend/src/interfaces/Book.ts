interface FetchedBook {
  id: number;
  authors: string;
  title: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
  available: boolean;
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
