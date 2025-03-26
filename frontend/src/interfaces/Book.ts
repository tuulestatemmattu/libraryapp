import { FetchedTag } from './Tags';

type BookStatus = 'available' | 'unavailable' | 'late' | 'borrowed' | 'ready' | 'reserved';

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
  dueDate: string;
  daysLeft: number;
  queuedByMe: boolean;
  queueTime: number;
  queueSize: number;
  status: BookStatus;
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

export type { BookStatus, CreatedBook, FetchedBook, AdminViewBook };
