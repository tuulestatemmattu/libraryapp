import { FetchedTag } from './Tags';

interface FetchedBook {
  id: number;
  authors: string;
  title: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
  borrowedByMe: boolean;
  queuedByMe: boolean;
  copies: number;
  copiesAvailable: number;
  lastBorrowedDate: Date;
  imageLink?: string;
  tags: FetchedTag[];
}

interface CreatedBook {
  authors: string;
  title: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
  copies: number;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  tags: FetchedTag[];
}

export type { CreatedBook, FetchedBook };
