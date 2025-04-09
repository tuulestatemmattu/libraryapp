import { create } from 'zustand';

import { FetchedBook } from '../interfaces/Book';
import Profile from '../interfaces/Profile';
import { fetchedRequest } from '../interfaces/Request';
import { FetchedTag } from '../interfaces/Tags';

interface StoreState {
  token: string | null;
  profile: Profile | null;
  setUser: (token: string, profile: Profile) => void;
  removeUser: () => void;

  location: string;
  setLocation: (location: string) => void;

  tags: FetchedTag[];
  setTags: (tags: FetchedTag[]) => void;
  addOrUpdateTag: (tag: FetchedTag) => void;
  deleteTag: (id: number) => void;

  books: FetchedBook[];
  setBooks: (books: FetchedBook[]) => void;
  addOrUpdateBook: (book: FetchedBook) => void;
  deleteBook: (id: number) => void;

  bookRequests: fetchedRequest[];
  setBookRequests: (bookRequests: fetchedRequest[]) => void;
  addBookRequest: (bookRequest: fetchedRequest) => void;
  deleteBookRequest: (id: number) => void;
}

const useMainStore = create<StoreState>((set) => ({
  token: null,
  profile: null,
  setUser: (token: string, profile: Profile) => set({ token, profile }),
  removeUser: () => set({ token: null, profile: null }),

  location: 'Helsinki',
  setLocation: (location: string) => set((state) => ({ ...state, location })),

  tags: [],
  setTags: (tags: FetchedTag[]) => set((state) => ({ ...state, tags })),
  addTag: (tag: FetchedTag) => set((state) => ({ ...state, tags: [...state.tags, tag] })),
  deleteTag: (id: number) => {
    const mapBook = (book: FetchedBook) => {
      return { ...book, tags: book.tags.filter((t) => t.id !== id) };
    };
    set((state) => ({
      ...state,
      tags: state.tags.filter((t) => t.id !== id),
      books: state.books.map(mapBook),
    }));
  },
  addOrUpdateTag: (tag: FetchedTag) => {
    const mapBook = (book: FetchedBook) => {
      return { ...book, tags: book.tags.map((t) => (t.id === tag.id ? tag : t)) };
    };
    set((state) => ({
      ...state,
      tags: [...state.tags.filter((t) => t.id !== tag.id), tag],
      books: state.books.map(mapBook),
    }));
  },

  books: [],
  setBooks: (books: FetchedBook[]) => set((state) => ({ ...state, books })),
  addOrUpdateBook: (book: FetchedBook) =>
    set((state) => ({
      ...state,
      books: [...state.books.filter((b) => b.id !== book.id), book],
    })),
  deleteBook: (id: number) =>
    set((state) => ({
      ...state,
      books: state.books.filter((book) => book.id !== id),
    })),

  bookRequests: [],
  setBookRequests: (bookRequests: fetchedRequest[]) => set((state) => ({ ...state, bookRequests })),
  addBookRequest: (bookRequest: fetchedRequest) =>
    set((state) => ({ ...state, bookRequests: [...state.bookRequests, bookRequest] })),
  deleteBookRequest: (id: number) =>
    set((state) => ({
      ...state,
      bookRequests: state.bookRequests.filter((bookRequest) => bookRequest.id != id),
    })),
}));

export default useMainStore;
