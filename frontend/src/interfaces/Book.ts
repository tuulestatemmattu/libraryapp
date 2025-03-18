import { FetchedTag } from './Tags';

interface FetchedBook {
  id: number;
  authors: string;
  title: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
  copies: number;
  copiesAvailable: number;
  imageLink?: string;

  tags: FetchedTag[];
  borrowedByMe: boolean;
  lastBorrowedDate: Date;
  queuedByMe: boolean;
  queueTime: number;
  queueSize: number;
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

interface AdminViewBook {
  id: number;
  title: string;
  authors: string;
  isbn: string;
  publishedDate: string;
  description: string;
  location: string;
  copies: number;
  copiesAvailable: number;
  imageLink?: string;
  tags: FetchedTag[];
}

export type { CreatedBook, FetchedBook, AdminViewBook };
